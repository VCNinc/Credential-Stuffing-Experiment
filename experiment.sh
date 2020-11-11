rm experiment.log

for I in {1..10}
do
	echo
	echo "TRIAL $I"
	echo "TRIAL,$I" >> experiment.log & node attack.js & node users.js
done
