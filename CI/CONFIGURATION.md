# CI/CD Configuration

## Contents

1. **[Initial Server Setup with Ubuntu](#Initial-Server-Setup-with-Ubuntu)**
    - **[Logging in as Root to VPS](#Logging-in-as-Root-to-VPS)**
    - **[Setting Up a Basic Firewall](#Setting-Up-a-Basic-Firewall)**
2. **[Install Nginx on Ubuntu](#Install-Nginx-on-Ubuntu)**.
    - **[Installing Nginx](#Installing-Nginx)**
    - **[Adjusting the Firewall](#Adjusting-the-Firewall)**
    - **[Web Server Status](#Web-Server-Status)**
    - **[Nginx Process](#Nginx-Process)**
    - **[Setting Up Server Blocks](#Setting-Up-Server-Blocks)**
3. **[SSL Certificates with Certbot for NGINX](#SSL-Certificates-with-Certbot-for-NGINX)**
    - **[Firewall Rules with UFW](#Firewall-Rules-with-UFW)**
    - **[Install Snapd](#Install-Snapd)**
    - **[Install Certbot](#Install-Certbot)**
    - **[Request SSL Certificate Using Certbot](#Request-SSL-Certificate-Using-Certbot)**
4. **[Install NodeJS on Ubuntu](#Install-NodeJS-on-Ubuntu)**
    - **[Install No dejs](#Install-Nodejs)**
    - **[Set Up Nginx as a Reverse Proxy Server](#Set-Up-Nginx-as-a-Reverse-Proxy-Server)**
5. **[Install PM2 on VPS](#Install-PM2-on-VPS)**
    - **[Install PM2 and CLI autocompletion](#Install-PM2-and-CLI-autocompletion)**
6. **[Install github cli on VPS](#Install-github-cli-on-VPS)**
    - **[Install gh on Debian and Ubuntu Linux](#Install-gh-on-Debian-and-Ubuntu-Linux)**
7. **[Set Up PM2 with Github Actions](#Set-Up-PM2-with-Github-Actions)**
    - **[Create a SSH key pair](#Create-a-SSH-key-pair)**
    - **[Remote server configuration](#Remote-server-configuration)**
    - **[Github Secrets configuration](#Github-Secrets-configuration)**
    - **[RSA deletion](#RSA-deletion)**
8. **[Monitoring CPU & Memory](#Monitoring-CPU-&-Memory)**
9. **[EnvVars Configuration](#EnvVars-Configuration)**

<br>

## **Description**
<hr>

This configuration allows CI/CD on any VPS Service (DO, Linode, etc..) using
Github Actions and PM2 to monitor your app.

**Let's begin!**

<br>

## **Configuration**
<hr>

<br>

## <ins>Initial Server Setup with Ubuntu</ins>
[Go to Content](#Contents)

### *Logging in as Root to VPS*

```bash
ssh root@your_server_ip
```

### *Setting Up a Basic Firewall*

```bash
ufw app list

ufw allow OpenSSH

ufw enable

ufw status
```

<br>

## <ins>Install Nginx on Ubuntu</ins>
[Go to Content](#Contents)

### *Installing Nginx*

```bash
sudo apt update

sudo apt install -y nginx 
```

### *Adjusting the Firewall*

```bash
sudo ufw app list

sudo ufw allow 'Nginx HTTP'

sudo ufw status
```

### *Web Server Status*

`systemctl status nginx`

Enter the server's IP address into your browser's address bar:

`http://your_server_ip`

You should get a webpage with the message: "Welcome to nginx! " 

### *Nginx Process*

To test nginx service, you can use the following commands:

```bash
sudo systemctl stop nginx

sudo systemctl start nginx

sudo systemctl restart nginx

sudo systemctl reload nginx

sudo systemctl status nginx
```

### *Setting Up Server Blocks*

**To configure nginx service, you can use the following commands:**

```bash
sudo mkdir -p /var/www/your_domain/html

sudo chown -R $USER:$USER /var/www/your_domain/html

sudo chmod -R 755 /var/www/your_domain

nano /var/www/your_domain/html/index.html
```

Inside `/var/www/your_domain/html/index.html` add the following: 

```html
<html>
    <head>
        <title>Welcome to your_domain!</title>
    </head>
    <body>
        <h1>Success! The your_domain server block is working!</h1>
    </body>
</html>
```

Run:
```bash
sudo nano /etc/nginx/sites-available/your_domain
```

Update `/etc/nginx/sites-available/your_domain` with the following:

```bash
server {
        listen 80;
        listen [::]:80;

        root /var/www/your_domain/html;
        index index.html index.htm index.nginx-debian.html;

        server_name your_domain.com www.your_domain;

        location / {
                try_files $uri $uri/ =404;
        }
}
```

**To enable the file, create a link from it to `sites-enable` director with the following command:**

```bash
sudo ln -s /etc/nginx/sites-available/your_domain /etc/nginx/sites-enabled/
```

To avoid a possible hash bucket memory problem that can arise from adding
additional server names, configure `/etc/nginx/nginx.conf` by removing `#` to
uncomment the line:

```bash
...
http {
    ...
    server_names_hash_bucket_size 64;
    ...
}
...
```

*Make sure there are no syntax errors in any Nginx file:*

```bash
sudo nginx -t

```

*Restart Nginx*

```bash
sudo systemctl restart nginx

```
<br>

## <ins>SSL Certificates with Certbot for NGINX</ins>
[Go to Content](#Contents)

### *Firewall Rules with UFW*

```bash
sudo apt update

sudo ufw allow ssh

sudo ufw allow http

sudo ufw allow https

sudo ufw enable

sudo ufw status

```

### *Install Snapd*

```bash
sudo apt update

sudo apt install snapd

sudo snap install core

sudo snap refresh core

```

### *Install Certbot*

```bash
sudo apt remove certbot

sudo snap install --classic certbot

sudo ln -s /snap/bin/certbot /usr/bin/certbot

```

### *Request SSL Certificate Using Certbot*

```bash
sudo ufw allow 'Nginx Full'

sudo ufw status numbered

sudo ufw delete 10 # ie. [10] Nginx HTTP   ALLOW IN    Anywhere

sudo ufw status

sudo certbot --nginx -d your_domain -d www.your_domain
```
<br>

## <ins>Install NodeJS on Ubuntu</ins>
[Go to Content](#Contents)

### *Install Nodejs*

```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

sudo apt-get install -y nodejs

node -v

npm -v

sudo apt install build-essential

```
*Note* <br>

- Node version: +16.x (don't use 17.x yet)

### *Set Up Nginx as a Reverse Proxy Server*

```bash
sudo nano /etc/nginx/sites-available/example.com
```

Within the `server` block, you should have an existing `location /` block.
Replace the contents of that block with the following configuration:

```
server {
...
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
...
}
```

Change port 3000 with your App's port (ie. `3150`).

Check that everything is ok:

```bash
sudo nginx -t
```

*Restart Nginx*

```bash
sudo systemctl restart nginx
```

<br>

## <ins>Install PM2 on VPS</ins>
[Go to Content](#Contents)

### *Install PM2 and CLI autocompletion*

```bash
sudo npm install pm2 -g

sudo apt update && sudo apt install curl && sudo curl -sL https://raw.githubusercontent.com/Unitech/pm2/master/packager/setup.deb.sh | sudo -E bash -

pm2 completion install
```

<br>

## <ins>Install github cli on VPS</ins>
[Go to Content](#Contents)

### *Install gh on Debian and Ubuntu Linux*

```bash
sudo curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

sudo apt update

sudo apt install gh

gh auth login
```

<br>


## <ins>Set Up PM2 with Github Actions</ins>
[Go to Content](#Contents)

### *Create a SSH key pair*

On your local machine, run:

```bash
ssh-keygen -t rsa -b 4096 -C "root@SERVER_IP_ADDRESS" -q -N ""
```

When prompted about file location, add whichever name you like, ie.
`github_rsa`.


### *Remote server configuration*

```bash
cat github_rsa.pub | xclip
```

You can use `xclip`, `pbcopy`, etc... or just plain cat and copy from terminal output.

Login to remote server, add the copied value to the `authorized_keys`:

```bash
echo "ssh-rsa AAAA....YOUR_PUBLIC_KEY..." >> ~/.ssh/authorized_keys
```

### *Github Secrets configuration*

- Secret key:
  - `cat github_rsa | xclip`
  - In Github, create a new secret named `SSH_PRIVATE_KEY` and paste in the contents.

- Known hosts:
  - `ssh-keyscan SERVER_IP > xclip`
  - In Github, create a new secret named `SSH_KNOWN_HOSTS` and paste in the contents.

### *RSA deletion*
Delete `github_rsa` and `github_rsa.pub`.

<br>

## <ins>Monitoring CPU & Memory</ins>
[Go to Content](#Contents)

Run `pm2 monitor` and follow instructions.

<br>

##  <ins>EnvVars Configuration</ins>
[Go to Content](#Contents)

- Before starting make sure to create a `.env` environment file and move it to
  home. 

Using `scp`:

  ```bash 
scp ./.env root@SERVER_IP_ADDR:/root
  ```

**Note** <br>
This step is to configure `env` inside the VPS (The `setup` script use this file).