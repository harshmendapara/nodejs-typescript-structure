git clone https://saiv2020@bitbucket.org/self-soverign-identity-solutions/api.git

curl -sL https://deb.nodesource.com/setup_10.x -o nodesource_setup.sh

#nano nodesource_setup.sh

sudo bash nodesource_setup.sh

sudo apt install nodejs

nodejs -v

npm -v

node --version

cd api/

npm i

pm2 -v

sudo npm i pm2 -g

ls

npm run pm2

pm2 list

pm2 logs

#pm2 restart
#pm3 delete
#pm2 delete app

