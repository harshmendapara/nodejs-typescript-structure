#!/bin/bash
# Script for cleaning the sample code folder - to be executed in VM
# Updated : April 2020

rm -rf sdk/node_modules     &> /dev/null
rm sdk/package-lock.json    &> /dev/null

rm -rf sdk/client/credstore &> /dev/null
rm -rf sdk/gateway/user-wallet  &> /dev/null



echo "Done."