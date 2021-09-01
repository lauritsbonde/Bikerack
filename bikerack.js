/*
    Bikerack opgave til CPH gamelab
    Laurits Bonde Henriksen
*/

let bikeRack = [];

function createEmptyBikeRack(spaces) {
    bikeRack = new Array(spaces).fill(false); //false = no bike, true = bike
}

function takeUpSpace(space) {
    if (space < bikeRack.length && !bikeRack[space]) {
        bikeRack[space] = true; //true = bike occupies space
    }
}

function leaveSpace(space) {
    if (space < bikeRack.length && bikeRack[space]) {
        bikeRack[space] = false; //false = open space
    }
}

//the "placements" paramater can take an array of ints, to place bikes at those indexes
//if nothing is passed in everything is random
function createRandomFilledBikeRack(spaces, placements = undefined) {
    console.log('');
    createEmptyBikeRack(spaces);

    // amount of random bikes to be placed or specified from "placements"
    const randomBikes = placements === undefined ? Math.round(Math.random() * (bikeRack.length - 1)) : placements.length;
    console.log('Bikerack spaces:', spaces);
    console.log('Random placed bikes:', randomBikes);

    //find a random place that is not occupied to place the bike or use "placements"
    for (let i = 0; i < randomBikes; i++) {
        let randomSpace;
        do {
            randomSpace = placements === undefined ? Math.round(Math.random() * (bikeRack.length - 1)) : placements[i];
        } while (bikeRack[randomSpace]); //true bikerack position = occupied place
        if (randomSpace < bikeRack.length) {
            takeUpSpace(randomSpace);
        }
    }
    printRack();
}

function findMaxDistancePlace() {
    if (bikeRack.length === 0) {
        return 'no spaces';
    }
    let lastBikePlace = undefined;
    let bikesBetween = -1; //Amount of bikes between where to park and the next bike
    let parkPlace = []; //the options for parking the bike

    for (let i = 0; i < bikeRack.length; i++) {
        //bike found, false = no bike, true = bike
        if (bikeRack[i]) {
            //first bike found
            if (lastBikePlace === undefined) {
                bikesBetween = i - 1;
                parkPlace = [0];
            } else {
                const sum = i + lastBikePlace;
                const middleSpot = sum / 2;
                const middles = [];
                //If the sum of the two bikeplaces is odd, then there is two middle values
                if (sum % 2 !== 0 && middleSpot !== 1) {
                    //two middles
                    middles.push({ place: Math.floor(middleSpot), dist: Math.floor(middleSpot) - lastBikePlace - 1 });
                    middles.push({ place: Math.ceil(middleSpot), dist: i - Math.ceil(middleSpot) - 1 });
                } else {
                    middles.push({ place: middleSpot, dist: i - Math.ceil(middleSpot) - 1 });
                }
                //check if the middlevalue(s) should be the new parkplace(s) or added to the possible places
                for (let j = 0; j < middles.length; j++) {
                    if (middles[j].dist > bikesBetween) {
                        bikesBetween = middles[j].dist;
                        parkPlace = [middles[j].place];
                    } else if (middles[j].dist === bikesBetween) {
                        parkPlace.push(middles[j].place);
                    }
                }
            }
            lastBikePlace = i;
        }
    }

    //Check last spot if it is not occupied
    if (!bikeRack[bikeRack.length]) {
        const currentBikesBetween = bikeRack.length - 1 - lastBikePlace - 1;
        if (currentBikesBetween > bikesBetween) {
            bikesBetween = currentBikesBetween;
            parkPlace = [bikeRack.length - 1];
        } else if (currentBikesBetween === bikesBetween) {
            parkPlace.push(bikeRack.length - 1);
        }
    }

    if (parkPlace.length !== 0) {
        const parkAtPlace = parkPlace.length === 1 ? 'Park in place: ' + parkPlace[0] : 'Park in one of these places: ' + parkPlace;
        return parkAtPlace + ' | Free spaces to closest bike: ' + bikesBetween;
    } else if (parkPlace.length === bikeRack.length * 2) {
        return 'All spots are filled';
    } else {
        return 'You can park whereever you want';
    }
}

function printRack() {
    console.table(bikeRack);
}

createRandomFilledBikeRack(12);
console.log(findMaxDistancePlace());
console.log('');
