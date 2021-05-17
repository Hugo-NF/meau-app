export type picturePath = string | null;

export interface ISignUpForm {
    fullName: string,
    birthDate: Date | null,
    email: string,
    state: string,
    city: string,
    address: string,
    phoneNumber: string,
    username: string,
    password: string,
    passwordConfirmation: string,
}
