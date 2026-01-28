const { default: mongoose } = require("mongoose");
const Channel = require("../models/Channel.model");
const User = require("../models/User.model");

// api to create channel
const createChannel = async (req, res) => {
  try {
    const { ownerId, channelName, about } = req.body;

    // create channel

    const newChannel = new Channel({
      ownerId,
      channelName,
      about,
    });

    // save channel

    await newChannel.save();

    return res
      .status(201)
      .json({ message: "Channel created successfully", channel: newChannel });
  } catch (err) {
    console.log("err", err);
  }
};

// get account details

const getAccountDetails = async(req, res) => {
   try{
        const {ownerId} = req.body

        const userDetails = await User.findById(ownerId)

        // 6970810b064d6fe8012bc4d7
       // logic
       const data = await User.aggregate([
        // stage 1
        {
           $match : {
            _id : new mongoose.Types.ObjectId(ownerId)
           }
        }, 
        // stage 2
        {
            $lookup : {
                from : "channels",
                localField : "_id",
                foreignField : "ownerId",
                as : "details"
            }
        },

        // stage 3

        {
            $unwind : {
                path : "$details"
            }
        },
        //  stage 4

    {
      $project : {
        channelName : "$details.channelName"
      }
    }

       ])

       return res.status(200).json({message : "data fetched",  data, userDetails})

    }catch(err){
        console.log("err", err)
    }
}


// controller to get user details, channel, video, video stats

const getAllDetails = async(req, res) => {
  try{
     const {userId} = req.params;

     const data = await User.aggregate([
       // logic
       // stage 1 - get user by id

       {
        $match : {
          _id : new mongoose.Types.ObjectId(userId)
        }
       },

      //  stage 2 -> perform join between two collections -> users and channels
      {
        $lookup : {
          from : "channels",
          localField : "_id",
          foreignField : "ownerId",
          as : "channel"
        }
      },

      // stage 3 -> get video data

      {
        $lookup : {
          from : "videos",
          localField : "channel._id",
          foreignField : "channelId",
          as : "videos"
        }
      },

      // stage 4
      {
        $lookup : {
          from : "videostats",
          localField : "videos._id",
          foreignField : "video_id",
          as : "stats"
        }
      },
      // stage 5

      {
        // operaiton name
      $addFields: {
        // new field name - your choice
          videos: {
            // map operation - iterate
            $map: {
              // iterate on videos array
              input: "$videos",
              // videos : [{v1}, {v2}, {v3}, {v4}]
              // stats : [{s1}, {s2}, {s3}, {s4}]
              as: "video",

              /*
               {
                  ...video,

               }
              */
              in: {
                $mergeObjects: [
                  "$$video",
                  {
                    stats: {
                      $arrayElemAt: [
                        {
                          //  // stats : [{s1}, {s2}, {s3}, {s4}]
                          $filter: {
                            input: "$stats",
                            as: "stat",
                            cond: { $eq: ["$$stat.video_id", "$$video._id"] }
                          }
                        },
                        0
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },

      {
        $project : {
          stats: 0
        }
      }
  
      
      

     ])

     return res.status(200).json({message : "All details fetched successfully", data})
  }catch(err){
    console.log("err", err)
  }
}

























// const getUserFullProfile = async (req, res) => {
//   try {
//     const {userId} = req.body;

//     const data = await User.aggregate([
//       {
//         $match: {
//           _id: new mongoose.Types.ObjectId(userId)
//         }
//       },

//       // Join Channel
//       {
//         $lookup: {
//           from: "channels",
//           localField: "_id",
//           foreignField: "ownerId",
//           as: "channel"
//         }
//       },

//       { $unwind: "$channel" },

//       // Join Videos
//       {
//         $lookup: {
//           from: "videos",
//           localField: "channel._id",
//           foreignField: "channelId",
//           as: "videos"
//         }
//       },

//       // Join VideoStats for each video
//       {
//         $lookup: {
//           from: "videostats",
//           localField: "videos._id",
//           foreignField: "ref",
//           as: "videoStats"
//         }
//       },

//       // Merge stats into videos
//       {
//         $addFields: {
//           videos: {
//             $map: {
//               input: "$videos",
//               as: "video",
//               in: {
//                 $mergeObjects: [
//                   "$$video",
//                   {
//                     stats: {
//                       $arrayElemAt: [
//                         {
//                           $filter: {
//                             input: "$videoStats",
//                             as: "stat",
//                             cond: { $eq: ["$$stat.ref", "$$video._id"] }
//                           }
//                         },
//                         0
//                       ]
//                     }
//                   }
//                 ]
//               }
//             }
//           }
//         }
//       },

//       // Remove temp field
//       // {
//       //   $project: {
//       //     videoStats: 0
//       //   }
//       // }
//     ]);

//     res.json({
//       success: true,
//       data
//     });

//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };


module.exports = {createChannel, getAccountDetails, getAllDetails}
