const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT || 5000;

let mongodbUrl = process.env.MONGO_URL

const {Schema} = mongoose

const experiencesSchema = new Schema({
    title: {type:String, required: true},
    description: String,
    location: String,
    price: Number,
    imageUrl: String,
    slots: [{type:Schema.Types.ObjectId, ref: 'Slot'}]
})

const slotSchema = new Schema({
    date: {type: String, required: true},
    time: {type: String, required: true},
    isBooked: {type: Boolean, default: false}
})

const bookingSchema =  new Schema({
    experienceId: {type:Schema.Types.ObjectId, ref: "Experience", required: true},
    slotId: {type: Schema.Types.ObjectId, ref: "Slot", required: true},
    name: {type: String, required: true},
    email: {type: String, required: true},
    promoCode: String
})

const promoSchema = new Schema({
    code: {type: String, required: true},
    discount: Number,
    experienceId: {type: Schema.Types.ObjectId, ref: "Experience", required: true}
})

const Experience = mongoose.model('Experience', experiencesSchema);
const Slot = mongoose.model('Slot', slotSchema);
const Booking = mongoose.model('Booking', bookingSchema);
const Promo = mongoose.model('Promo', promoSchema);


const experiencesData = [
  {
    title: "Kayaking",
    location: "Udupi",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813504/Lakshadweep_fsmfqj.jpg'
  },
  {
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 899,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813507/NandiHills_jlfxjr.jpg',
  },
  {
    title: "Coffee Trail",
    location: "Coorg",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 1299,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813504/CoffeeTrail_fr9qhe.jpg'
  },
  {
    title: "Kayaking",
    location: "Udupi, Karnataka",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 999,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813506/Kashmir_Valley_xkyumg.jpg'
  },
  {
    title: "Nandi Hills Sunrise",
    location: "Bangalore",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 899,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813506/Majuli-River-island_smjst7.jpg'
  },
  {
    title: "Boat Cruise",
    location: "Sunderban",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 1099,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813506/Araku_valley_h4emhv.jpg'
  },
  {
    title: "Bunjee Jumping",
    location: "Manali",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 2999,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813505/mount_abu_x8dqxi.jpg'
  },
  {
    title: "Coffee Trail",
    location: "Coorg",
    description: "Curated small-group experience. Certified guide. Safety first with gear included.",
    price: 1299,
    imageUrl: 'https://res.cloudinary.com/dgdoej1q8/image/upload/v1761813506/kayaking_eenehv.jpg'
  }
];

const promoList = [
  { codes: ["SAVE10", "SAVE20"], discounts: [10, 20] },
  { codes: ["FLAT50"], discounts: [50] },
  { codes: ["COFFEE15"], discounts: [15] },
  { codes: ["BOAT20"], discounts: [20] },
  { codes: ["NANDI5"], discounts: [5] },
  { codes: ["TRAIL25"], discounts: [25] },
  { codes: ["BUNJEE30"], discounts: [30] },
  { codes: ["MANALI10"], discounts: [10] }
];


const DataSeeding = async () => {
  try {
    const count = await Experience.countDocuments();
    console.log("Experience count:", count);
    if(count === 0) {
      await Experience.insertMany(experiencesData);
      console.log("Data Inserted Successfully");
    } else {
      console.log("Experiences already present, skipping seeding");
    }
  } catch (err) {
    console.log("Data Seeding Error:", err);
  }
};

const addSlotAndPromoCodes = async() => {
    const dates = ["2025-10-22", "2025-10-23", "2025-10-24", "2025-10-25", "2025-10-26"]
    const times = ["07:00 AM", "09:00 AM", "11:00 AM", "03:00 PM"]
    const experiencesArray = await Experience.find()
    for (let i=0; i<experiencesArray.length; i++){
        const selectedexperience = experiencesArray[i]
        let slotIds = []
        for (let m = 0; m<dates.length; m++){
            for (let t = 0; t<times.length; t++){
                const isBooked = Math.random() <0.3;
                const slot =  new Slot({
                    date: dates[m],
                    time: times[t],
                    isBooked
                })
                await slot.save()
                slotIds.push(slot._id)
        }
    }
    await Experience.findByIdAndUpdate(
        selectedexperience._id,
        {$set: {slots: slotIds}}
    )

    if(promoList[i]){
        for(let j = 0; j < promoList[i].codes.length; j++){
            await Promo.create({
                code: promoList[i].codes[j],
                discount: promoList[i].discounts[j],
                experienceId: selectedexperience._id
            });
        }
    }
}
console.log('Slots and Promo Codes created for all Experiences')
}

const initializeDbAndServer = async() => {
    try{
         await mongoose.connect(mongodbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log('MongoDB connected Successfully')
        await DataSeeding()
        await addSlotAndPromoCodes()
    } catch(e){
        console.log('MongoDB Connection Failed:', e)
        process.exit(1)
    }
}
initializeDbAndServer()

//List of all Experiences

app.get('/experiences', async(request, response) => {
    try{
        const experience = await Experience.find();
        response.json(experience)
    } catch(error){
        response.json({error: error.message})
    }
})

// GET experience By Id

app.get('/experiences/:id', async(request,response) => {
    const {id} = request.params
    try{
        const experience = await Experience.findById(id).populate('slots');
        if (!experience) return response.json({error: 'Experience not Found'})
        response.json(experience)
    } catch(error){
        response.json({error: 'Server Error'})
    }
})

//Post Method to accept Booking Details

app.post('/bookings', async(request,response) => {
    const {experienceId, slotId, name, email, promoCode} = request.body

    if (!experienceId ||!slotId||!name||!email){
        return response.json({error: 'Missing required Fields'})
    }
    try{
        const slot = await Slot.findById(slotId)
        if(!slot||slot.isBooked){
            return response.json({error:"Slot already booked or Sold Out"})
        }

        slot.isBooked = true
        await slot.save()

        const slotBooking = new Booking({experienceId, slotId, name, email, promoCode})
        await slotBooking.save()
        
        response.json({message: 'Booking Successful',bookingId: slotBooking._id})
    } catch(error){
        console.error('Booking error:', error);
        response.json({error:error.message})
    }
})

app.post('/promo/validate', async(request, response) => {
    const {code, experienceId} = request.body
    if(!code || !experienceId) return response.json({error: 'Promo code and experience Id Required'})
    try{
        const promo = await Promo.findOne({code: code.toUpperCase(), experienceId})
        if (!promo) return response.json({error: 'Invalid Promo Code'})
        response.json({valid: true, discount: promo.discount})
    } catch(e){
        response.json({error: 'Server Error'})
    }
})

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});