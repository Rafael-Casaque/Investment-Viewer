export class Validation {
  static validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) return true;
    else throw new Error("invalid email");
  };

  static validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (passwordRegex.test(password)) return true;
    else throw new Error("invalid password");
  };

  static validateName = (name: string) => {
    const nameRegex = /^\s*[a-zA-Z]{4,25}\s*$/;
    if (nameRegex.test(name)) return true;
    else throw new Error("invalid name");
  };
}
