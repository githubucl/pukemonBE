const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    min: 3,
    max: 20,
    lowercase: true,
    unique: true,
  },
  id: {
    type: String,
    required: true,
  },
  room: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
});
const Users = mongoose.model("Users", userSchema);

module.exports = Users;
