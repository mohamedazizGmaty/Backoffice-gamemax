export class User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureUrl: string;
  role: string;
  enabled: boolean;
  username: string;
  imagePath: string;

  constructor(
    userId: number,
    firstName: string,
    lastName: string,
    email: string,
    profilePictureUrl: string,
    role: string,
    enabled: boolean,
    username: string,
    imagePath: string
  ) {
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.profilePictureUrl = profilePictureUrl;
    this.role = role;
    this.enabled = enabled;
    this.username = username;
    this.imagePath = imagePath;
  }
}
