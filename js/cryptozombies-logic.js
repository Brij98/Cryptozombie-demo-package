var cryptoZombies;
var userAccount;
const showZombieButton = document.getElementById('showZombieButton');
const createzombieButton = document.getElementById('createzombieButton');
const levelupButton = document.getElementById('levelupButton');
const feedOnKittyButton = document.getElementById('feedOnKittyButton');
const ownerofButton = document.getElementById('ownerofButton');
const changeZombieNameTxt = document.getElementById('changeZombieNameTxt');
const changeZombieNameButton = document.getElementById('changeZombieNameButton');
const changeZombieDNATxt = document.getElementById('changeZombieDNATxt');
const changeZombieDNAButton = document.getElementById('changeZombieDNAButton');
const withdrawButton = document.getElementById('withdrawButton');
const changeFeeTxt = document.getElementById('changeLevelUpFee');
const changeFeeButton = document.getElementById('changeFeeButton');
const levelUpFee = "0.001";



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
            <li>CryptoKitty's DNA: ${zombie.targetDNA}</li>
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

        $("#txStatusError").text(error);
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
        $("#txStatusError").text(error);
    });
}

function levelUp(zombieId) {
    $("#txStatus").text("Leveling up your zombie...");
    return cryptoZombies.methods.levelUp(zombieId)
    .send({ from: userAccount, value: web3.utils.toWei(levelUpFee, "ether") })
    .on("receipt", function (receipt) {
        $("#txStatus").text("Power overwhelming! Zombie successfully leveled up");

        getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
        $("#txStatusError").text(error);
    });
}

function changeZombieDNA(zombieId, newDNA) {
    $("#txStatus").text("Changing your zombie's DNA...");
    return cryptoZombies.methods.changeDna(zombieId, newDNA)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
        $("#txStatus").text("Zombie's DNA successfully changed");

        getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
        $("#txStatusError").text(error);
    });
}


function changeZombieName(zombieId, newName){
    $("#txStatus").text("Changing your zombie's Name...");
    return cryptoZombies.methods.changeName(zombieId, newName)
    .send({ from: userAccount })
    .on("receipt", function (receipt) {
        $("#txStatus").text("Zombie's Name successfully changed");

        getZombiesByOwner(userAccount).then(displayZombies);
    })
    .on("error", function (error) {
        $("#txStatusError").text(error);
    });
}
function withdraw(){
	$("#txStatus").text("Withdrawing ether...");
	return cryptoZombies.methods.withdraw()
	.send({ from: userAccount })
	.on("receipt", function(receipt) {
		$("#txStatus").text("Ether has been withdrawn");
	})
	.on("error", function(error) {
		$("#txStatusError").text(error);
	});
}

//level-up functionality would need to retrieve the set fee
function setLevelUpFee(fee){
	$("#txStatus").text("Changing level-up fee...");
	return cryptoZombies.methods.setLevelUpFee(fee)
	.send({ from: userAccount })
	.on("receipt", function(receipt) {
		$("#txStatus").text("Level-up fee has been altered");
	})
	.on("error", function(error) {
		$("#txStatusError").text(error);
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

function display_image(image) {
    document.getElementById("image").src = image_url;
}

function getRandomKitty() {
    const app = document.getElementById('cat')

    const logo = document.createElement('img')
    logo.src = 'kitty578397.svg'

    const container = document.createElement('div')
    container.setAttribute('class', 'container')

    app.appendChild(logo)
    app.appendChild(container)

    var request = new XMLHttpRequest()
    request.open('GET', 'https://api.cryptokitties.co/kitties/', true)
    request.onload = function () {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response)
    if (request.status >= 200 && request.status < 400) {
        data.forEach(kitty => {
        const card = document.createElement('div')
        card.setAttribute('class', 'card')

        const h1 = document.createElement('h1')
        h1.textContent = kitty.id

        const p = document.createElement('p')
        //document.getElementById(catimage).src = cat.image_url_png

        container.appendChild(card)
        card.appendChild(h1)
        card.appendChild(p)
        })
    } else {
        const errorMessage = document.createElement('error')
        errorMessage.textContent = `Sigh, it's not working!`
        app.appendChild(errorMessage)
    }
    }

    request.send()
}

// UI Popup text input 
// function pop() {
//     let text;
//     let kittyId = prompt("Enter a kitty's ID", "Kitty ID");
//     if (kittyId == null || kittyId == "") {
//         text = "User cancelled the prompt.";
//     } else {
//         text = "Kitty" + kittyId + " was eaten!";
//     }
//     document.getElementById("demo").innerHTML = text;

//     let apiUrl = "https://api.cryptokitties.co/kitties/" + kittyId;
//     $.get(apiUrl, function(data) {
//         let imgUrl = data.image_url
//     })
// }

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

changeZombieDNAButton.addEventListener('click', () => {
    // getZombiesByOwner(userAccount)
    //     .then(changeZombieDNA(userAccount, changeZombieDNATxt.value));
    getZombiesByOwner(userAccount)
    .then(function (result) {
        changeZombieDNA(result, parseInt(changeZombieDNATxt.value));
        changeZombieDNATxt.value = "";
    });
});

changeZombieNameButton.addEventListener('click', () => {
    getZombiesByOwner(userAccount)
    .then(function (result) {
        changeZombieName(result, changeZombieNameTxt.value);
        changeZombieNameTxt.value = "";
    })
});

changeFeeButton.addEventListener('click', () => {
    setLevelUpFee(parseFloat(changeFeeTxt.value));
    levelUpFee = changeFeeTxt.value;
	changeFeeTxt.value = "";
});

withdrawButton.addEventListener('click', () => {
	withdraw();

});

// feedOnKittyButton.addEventListener('click', () => {
//     feedOnKitty(userAccount, 2011363);
// });

feedOnKittyButton.addEventListener('click', () => {
    feedOnKitty(userAccount)
        .then(levelUp);
});


ownerofButton.addEventListener('click', () => {
    // $("#txStatus").text(getOwnerByZombieId(parseInt(document.getElementById('ownerofTxt').value)));
    getOwnerByZombieId(parseInt(document.getElementById('ownerofTxt').value))
    .then(function (result) {
        $("#txStatus").text(result);
    });
});
