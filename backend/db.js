db = {
  type:{
    category: String ("Type/Genre"),
    name: String
  },
  user: {
    name: String,
    lastname: String,
    alias: String,
    profile: String,
    email: String,
    folders: [{
      name: String,
      type: Reference(Type),
      genre: Reference(Type),
      art: [Reference(Art)]
    }]
  },
  art: {
    name: String,
    content: String,
    folder: folderID,
    type: Reference(Type),
    genre: Reference(Genre)
  }
}