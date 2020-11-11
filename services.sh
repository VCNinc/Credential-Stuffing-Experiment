

for I in {3000..3009}
do
	echo
	echo "STARTING SERVICE $I"
	node index.js --port $I &
done
