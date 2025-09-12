---
layout: post
title: "Using MFA/2FA with AWS CLI/CDK and 1Password for MacOS"
author: alexander
tags:
  - Development
  - Coding
  - Security
image: assets/images/security.png
featured: true
categories:
  - Development
  - Security
---

When you're using AWS on the CLI or with the CDK, you have to set up your credentials and you commonly have an Access Key and a Secret Key. Those are static and if anyone get a hold of them, they can do whatever they like with _your_ AWS account. I had a co-worker once who had a commit with his AWS keys in it. Not even the latest commit, but one in the history. People have bots that are constantly scanning GitHub for AWS keys. He came in on Monday and got a bill for over $10,000 because someone had used his keys to spin up a bunch of EC2 instances and other resources. That was a fun conversation with AWS support...

It's easy to make mistakes, we're all human. So it's a good idea to enable MFA/2FA on your AWS account. This means that in addition to your Access Key and Secret Key, you also need a time-based one-time password (TOTP) from an authenticator app like 1Password. This adds an extra layer of security to your AWS account, but it can be a huge pain to use the cli or cdk with it enabled because you always have to first get a temporary session token from `aws sts`. I've worked out a script that makes it easy to let 1Password handle the MFA/2FA _and_ your AWS keys so nothing is statically stored on your machine.

Let's look at how to set this up.

## Prerequisites

- You need to have the AWS CLI installed. You can find instructions [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html){:target="_blank" rel="noopener noreferrer"}.
- You'll also need to have MFA enabled on your AWS account. You can find instructions [here](https://docs.aws.amazon.com/IAM/latest/UserGuide/id_credentials_mfa_enable_virtual.html){:target="_blank" rel="noopener noreferrer"}.
- You need to have 1Password installed and set up. You can find instructions [here](https://1password.com/downloads/){:target="_blank" rel="noopener noreferrer"}.

## Setting Up 1Password

First, make sure you have 1Password CLI installed. You can find instructions [here](https://developer.1password.com/docs/cli/get-started/){:target="_blank" rel="noopener noreferrer"}. Don't forget to enable `Integrate with 1Password CLI` in your 1Password app settings under `Developer`.

  ```sh
  brew install 1password-cli

  # sign in once
  eval $(op signin)
  ```

1. Add an entry in 1Password for your AWS credentials. Let's use the same one that you used to add your MFA in the Prerequisites above.
  - Add a new text field named `Access Key ID` and put your AWS Access Key ID in it.
  - Add a new password field named `Secret Access Key` and put your AWS Secret Access Key in it.
  - Add a new text field named `mfa serial` and put the ARN of your MFA device in it. You can find this in the AWS console under IAM > Users > Security Credentials > Assigned MFA device. Usually it looks something like `arn:aws:iam::123456789012:mfa/your-username`.
2. Install the 1Password aws cli plugin with `op plugin init aws`.
3. Install the 1Password aws cdk plugin with `op plugin init cdk`.
4. Add to your shell rc file (e.g. `~/.zshrc`, `~/.bashrc`, etc.) `source ~/.config/op/plugins.sh` to make sure your 1Password plugins are loaded on your path.

Now we're ready to set up our magical script.

## The Script (where the magic happens)

You'll want to create a file named `credential_process.sh` in your `~/.aws/` directory.

The file should look like this:

```sh
#!/bin/bash
set -e

op_vault=""
op_item=""
aws_credential_duration=""

export PATH="/opt/homebrew/bin:$PATH"

parse_args() {
  while [[ $# -gt 0 ]]; do
    case "$1" in
      --op-vault)
        op_vault="$2"; shift 2 ;;
      --op-vault=*)
        op_vault="${1#*=}"; shift ;;
      --op-item)
        op_item="$2"; shift 2 ;;
      --op-item=*)
        op_item="${1#*=}"; shift ;;
      --duration|--aws-credential-duration)
        aws_credential_duration="$2"; shift 2 ;;
      --duration=*|--aws-credential-duration=*)
        aws_credential_duration="${1#*=}"; shift ;;
      -h|--help)
        usage; exit 0 ;;
      --) # end of options
        shift; break ;;
      *)
        echo "Unknown option: $1" >&2
    esac
  done

  if [[ -z "$op_vault" || -z "$op_item" || -z "$aws_credential_duration" ]]; then
    echo "Missing required options." >&2
    usage; exit 1
  fi

  if ! [[ "$aws_credential_duration" =~ ^[0-9]+$ ]]; then
    echo "Error: --duration must be an integer (seconds)." >&2
    exit 1
  fi
}

main() {
  local mfa_token
  local fields
  mfa_token="$(op item get "$op_item" --otp --vault "$op_vault")"
  fields="$(op item get "$op_item" --fields "label=Access Key ID,label=Secret Access Key,label=mfa serial" --reveal --vault "$op_vault")"
  IFS=',' read -r access_key secret_key mfa_serial <<< "$fields"

  AWS_ACCESS_KEY_ID="$access_key" \
  AWS_SECRET_ACCESS_KEY="$secret_key" \
  aws sts get-session-token \
    --serial-number "$mfa_serial" \
    --token-code "$mfa_token" \
    --duration-seconds "$aws_credential_duration" \
    --output json \
    --query 'Credentials | {Version: `1`, AccessKeyId: AccessKeyId, SecretAccessKey: SecretAccessKey, SessionToken: SessionToken, Expiration: Expiration}'
}

parse_args "$@"
main
```

You should be able to copy and paste that as-is. Once you save the file, make it executable with `chmod +x ~/.aws/credential_process.sh`.

What it does is ensures homebrew is on your path, then it uses the 1Password CLI to first get the current MFA token, then it reads those fields we set up for the Access Key, Secret Key, and MFA serial. Finally, it calls `aws sts get-session-token` with those values to get a temporary session token that is valid for the duration you specify. It needs to be in a very specific JSON format so AWS can read it, which is what the `--query` at the end is for. The only tools being used here are `op` and `aws sts`, the credentials are never stored on your machine or sent anywhere else.

## Setting Up AWS CLI/CDK to Use 1Password

1. Navigate to `~/.aws/` and `ls` to see if you have a `config` and `credentials` file.
  - If you have both, then delete the `credentials` file. We won't be using it.
2. Open the `config` file in your favorite text editor like `nvim config`, if you're not using nvim or vim, make sure to `touch config` to create it if it doesn't exist.
3. We'll want our config to look something like this:

  ```ini
  [default]
  region = us-east-1 # or your preferred region
  output = json
  credential_process = /Users/<your-username>/.aws/credential_process.sh --op-vault "Your 1Password Vault Name" --op-item "Your 1Password Item Name" --duration 3600
  ```

Save your config file and exit your text editor.

**note: the maximum duration you can set is 3600 seconds (1 hour). If you set it higher, sts will just set it to 1 hour.**

You should now be able to test it with `aws s3 ls` and you'll get prompted to unlock 1Password if it's not already unlocked and then it will list your S3 buckets (assuming you have the necessary permissions).

You can re-use that same config for other profiles in the `config` file as well, just by adding the `credential_process` line to each profile section.

Happy coding!