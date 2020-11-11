rm experiment.log

for I in {1..100}
do
	echo
	echo "TRIAL $I"
	echo "TRIAL,$I" >> experiment.log & node attack.js & node users.js
done
