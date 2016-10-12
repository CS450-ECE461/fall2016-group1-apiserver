## Development Environment Setup ##
You need to install git, Node.js, and (if not included with Node.js) NPM.
In general, you'll need Node.js >v4.0.0 and NPM >v3.0.0.

Linux users: using stock package repos for Node.js and NPM are generally not recommended.

[Node.js Official Installation Instructions](https://nodejs.org/en/download/package-manager/)

##### Ubuntu/Debian #####
```
sudo apt install git curl build-essential
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt install -y nodejs
```
##### RHEL/Fedora/CentOS #####
```
yum install git curl gcc-c++ make
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
yum install nodejs
```
##### Mac #####
For Node.js:
```
curl "https://nodejs.org/dist/latest/node-${VERSION:-$(wget -qO- https://nodejs.org/dist/latest/ | sed -nE 's|.*>node-(.*)\.pkg</a>.*|\1|p')}.pkg" > "$HOME/Downloads/node-latest.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-latest.pkg" -target "/"
```
Install Git from [their site](https://git-scm.com/download/mac). You're on your own after that.

##### Windows #####
Download and install Node.js v6 directly from [their site](https://nodejs.org/en/#download), and Git directly from [their site](https://git-scm.com/download/win).
You're on your own after that (or just use Linux).


### Installing the Project ###
Change directory to your projects folder, then: 
```
git clone https://gitlab.bdfoster.com/450-team-1/starter-repo.git
cd starter-repo
npm install --dev
```
