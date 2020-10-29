cd dist
git init
git add .
git commit -m "deploy"
git push -f git@github.com:mocobk/mp-qrcode-test.git master:gh-pages
cd ..
