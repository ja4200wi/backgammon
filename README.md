# Backgammon

We want to build a backgammon app for mobile users enabling online real-time games.

# Setup of your environment

You need on your machine:

1. XCode (newest version: update of your mac to newest OS might be necessary)
2. Ruby (at least 2.10 as fa as I can remember)
3. CocoaPods

Helpful links:

- https://reactnative.dev/docs/environment-setup
- https://reactnative.dev/docs/running-on-device

# Testing the application

## On your iPhone connected via cable

1. Connect your phone and open XCode
2. In Xcode menu bar: Select Product > Destination > set your phone as target (on the first time you need to set up a team in XCode and enable yourself as a developer on your iPhone under Settings > General > Developer Mode On, also you need to trust yourself as a developer)
3. Start the server inside the frontend folder using "npm start"
4. use either XCode (worked better for me) or also follow the instructions of the README of the frontend folder

## Emulating an iPhone using XCode

This can be set as destination in XCode as well the rest of the steps stay the same
