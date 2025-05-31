dotnet new -i Amazon.Lambda.Templates
dotnet tool install -g Amazon.Lambda.Tools
cd dotnet-core/
cd TodoApi/
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install
aws --version
aws configure
aws lambda list-functions --region eu-west-2
dotnet lambda deploy-function todo-function --function-role arn:aws:iam::XXX:role/service-role/todo-function-role-YYY --function-runtime dotnet8

dotnet lambda invoke-function todo-function --cli-binary-format raw-in-base64-out --payload "merhaba dünya"
