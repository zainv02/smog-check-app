

read -r -p "### do you want to import a dump? default dump at \"path\" [Y/n]: " x

x=${x,,}

if [[ "$x" =~ ^(yes|y)$ ]] || [ -z "$x" ]; then

    echo -e "ok. doing ${x}"

else

    echo -e "very wehll. not doing"

fi