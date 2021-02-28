if ! [ $(id -u) = 0 ]; then
   echo "The script need to be run as root." >&2
   exit 1
fi

#get variables from .env
db_name="db_name"
db_dump="db_dump.sql"
user_name="user_name"
server_ip="server_ip"
user_password="user_password"

echo "PREPARE MySQL TO IMPORT"
mysql -e "DROP DATABASE IF EXISTS $db_name; 
          CREATE DATABASE $db_name;
          DROP USER IF EXISTS '$user_name'@'$server_ip'; 
          CREATE USER '$user_name'@'$server_ip' IDENTIFIED WITH mysql_native_password BY '$user_password';
          ALTER USER '$user_name'@'$server_ip' IDENTIFIED WITH mysql_native_password BY '$user_password';
          GRANT ALL ON $db_name.* TO '$user_name'@'$server_ip';
          FLUSH PRIVILEGES;";

echo "PREPARE postgres TO IMPORT"
sudo -u postgres -H -- psql -c "DROP DATABASE IF EXISTS $db_name;"
sudo -u postgres -H -- psql -c "CREATE DATABASE $db_name;"
sudo -u postgres -H -- psql -c "DROP USER IF EXISTS $user_name; 
                                CREATE USER $user_name WITH PASSWORD '$user_password';
                                GRANT ALL PRIVILEGES ON DATABASE $db_name to $user_name;"

echo "IMPORT TO MySQL"
mysql $db_name < $db_dump

echo "LOAD DATABASE
   FROM mysql://$user_name:$user_password@$server_ip/$db_name
   INTO pgsql://$user_name:$user_password@$server_ip/$db_name
   
   WITH 
      no truncate, create tables, include drop, create indexes, reset sequences, foreign keys, quote identifiers, uniquify index names
      
   CAST
       type int when unsigned drop typemod;" > pgsql-migrate-command.cmd

echo "MIGRATING FROM MySQL TO postgres"
pgloader pgsql-migrate-command.cmd
rm pgsql-migrate-command.cmd