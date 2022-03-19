var cryptoZombies;
var userAccount;
const showZombieButton = document.getElementById('showZombieButton');
const createzombieButton = document.getElementById('createzombieButton');
const levelupButton = document.getElementById('levelupButton');
const feedOnKittyButton = document.getElementById('feedOnKittyButton');
const ownerofButton = document.getElementById('ownerofButton');

function startApp() {

    //ZombieOwnership contratc address
    var cryptoZombiesAddress = "0xD72Cc9593eC58CcE517A3Bd3aF119828391ae48C";
    // var cryptoKittiesAddress = "0x06012c8cf97BEaD5deAe237070F9587f8E7A266d";
    cryptoZombies = new web3.eth.Contract(cryptoZombiesABI, cryptoZombiesAddress);
//the following code from Lesson 6, chapter 5 is obsolete
//     var accountInterval = setInterval(function () {

//      if (web3.eth.accounts[0] !== userAccount) {
        //userAccount = web3.eth.accounts[0];

    //     getZombiesByOwner(userAccount)
    //      .then(displayZombies);
    //  }
    // }, 100);

    cryptoZombies.events.Transfer({ filter: { _to: userAccount } })
    .on("data", function (event) {
        let data = event.returnValues;
        getZombiesByOwner(userAccount).then(displayZombies);
    }).on("error", console.error);

    // cryptoZombies.methods.setKittyContractAddress(cryptoKittiesAddress)
    // .send({from: userAccount})
    // .on("receipt", function (receipt) {
    //     $("#txStatus").text("Successfully setKittyContractAddress")
    // })
    // .on("error",  function (error) {
    //     $("#txStatus").text(error);
    // });

}

function displayZombies(ids) {
    $("#zombies").empty();
    for (id of ids) {

    getZombieDetails(id)
        .then(function (zombie) {


        $("#zombies").append(`<div class="zombie">
            <ul>
            <li>Name: ${zombie.name}</li>
            <li>DNA: ${zombie.dna}</li>
            <li>Level: ${zombie.level}</li>
            <li>Wins: ${zombie.winCount}</li>
            <li>Losses: ${zombie.lossCount}</li>
            <li>Ready Time: ${zombie.readyTime}</li>
            </ul>
        </div>`);
        });
    }

}

function createRandomZombie(name) {


    $("#txStatus").text("Creating new zombie on the blockchain. This may take a while...");

    return cryptoZombies.methods.createRandomZombie(name)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
        $("#txStatus").text("Successfully created " + name + "!");

        getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {

        $("#txStatus").text(error);
    });
}

function feedOnKitty(zombieId, kittyId) {
    $("#txStatus").text("Eating a kitty. This may take a while...");
    return cryptoZombies.methods.feedOnKitty(zombieId, kittyId)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
        $("#txStatus").text("Ate a kitty and spawned a new Zombie!");
        getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
        $("#txStatus").text(error);
    });
}

function levelUp(zombieId) {
    $("#txStatus").text("Leveling up your zombie...");
    return cryptoZombies.methods.levelUp(zombieId)
    .send({ from: userAccount, value: web3.utils.toWei("0.001", "ether") })
    .on("receipt", function (receipt) {
        $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");

        getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
        $("#txStatus").text(error);
    });
}

function getZombieDetails(id) {
    return cryptoZombies.methods.zombies(id).call()
}

function zombieToOwner(id) {
    return cryptoZombies.methods.zombieToOwner(id).call()
}

function getZombiesByOwner(owner) {
    return cryptoZombies.methods.getZombiesByOwner(owner).call();
}

function getOwnerByZombieId(zombieId) {
    return cryptoZombies.methods.ownerOf(zombieId).call();
}

window.addEventListener('load', async () => {
// Modern dapp browsers...
if (window.ethereum) {
    window.web3 = new Web3(ethereum);
    try {
        // Request account access if needed
        const accounts = await ethereum.enable();
        // Acccounts now exposed
        userAccount = accounts[0];
        startApp()
    } catch (error) {
        // User denied account access...
    }
}
// Legacy dapp browsers...
else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    // Acccounts always exposed
    userAccount = web3.eth.accounts[0];
    startApp()
}
// Non-dapp browsers...
else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
}
});

//the following code from Lesson 6, chapter 2 is obsolete
//metamask no longer inject web3 since early 2021
//window.addEventListener('load', function () {

//    if (typeof web3 !== 'undefined') {
//     web3js = new Web3(web3.currentProvider);
//   } else {

//  }


//  startApp()

//  }) 

ethereum.on('accountsChanged', (accounts) => {
    window.location.reload();
});

ethereum.on('chainChanged', (chainId) => {
    window.location.reload(); 
});  


createzombieButton.addEventListener('click', () => {
    createRandomZombie(userAccount);

});

showZombieButton.addEventListener('click', () => {
    getZombiesByOwner(userAccount)
        .then(displayZombies);

});

levelupButton.addEventListener('click', () => {
    getZombiesByOwner(userAccount)
        .then(levelUp);

});

// feedOnKittyButton.addEventListener('click', () => {
//     feedOnKitty(userAccount, 2011363);
// });

ownerofButton.addEventListener('click', () => {
    // $("#txStatus").text(getOwnerByZombieId(parseInt(document.getElementById('ownerofTxt').value)));
    getOwnerByZombieId(parseInt(document.getElementById('ownerofTxt').value))
    .then(function (result) {
        $("#txStatus").text(result);
    });
});