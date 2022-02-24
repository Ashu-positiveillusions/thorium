const express = require('express');
const router = express.Router();

let players =
   [
       {
           "name": "manish",
           "dob": "1/1/1995",
           "gender": "male",
           "city": "jalandhar",
           "sports": [
               "swimming"
           ],
           "bookings": [
            {
                "bookingNumber": "1",
                "sportId": "",
                "centerId": "",
                "type": "private",
                "slot": '16286598000000',
                "bookedOn": '31/08/2021',
                "bookedFor": '01/09/2021'
            },
            {
                "bookingNumber": "2",
                "sportId": "",
                "centerId": "",
                "type": "private",
                "slot": '16286518000000',
                "bookedOn": '31/08/2001',
                "bookedFor": '01/09/2001'
            },
        ]
    },
    {
        "name": "gopal",
        "dob": "1/09/1995",
        "gender": "male",
        "city": "delhi",
        "sports": [
            "soccer"
        ],
        "bookings": []
    },
    {
        "name": "lokesh",
        "dob": "1/1/1990",
        "gender": "male",
        "city": "mumbai",
        "sports": [
            "soccer"
        ],
        "bookings": []
    },
]

router.post('/players', function(req, res) {
    let playerDetails = req.body.element;
    for(let i=0;i<players.length;i++){
        if(players[i].name===playerDetails.name){
            return res.send("Already exists");
            break;
        }
    }players.push(playerDetails);
    res.send({ "msg": players })
})

router.post('/players/:playerName/bookings/:bookingId', function(req, res) {
    let name = req.params.playerName;
    let bookId = req.params.bookingId;
    let userGivenPlayer = req.body.khiladi;
    
    for (let j=0;j<players.length;j++){
        if(name===players[j].name){
            let bookingArray = players[j].bookings;
            if(bookingArray===[]){
                bookingArray.push(userGivenPlayer)
                return res.send(players);
            }else{
                    for(let k=0;k<bookingArray.length;k++){
                        if(bookingArray[k].bookingNumber===bookId){
                            return res.send("Booking already exists.")
                        }
                    }bookingArray.push(userGivenPlayer);
                    return res.send(players);
            }
        }
    }res.send("No such player exists.")
})
module.exports = router;