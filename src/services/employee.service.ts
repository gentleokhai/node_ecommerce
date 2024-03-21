import { CreateEmployeeInput } from '../dto/employee';
import { Status } from '../dto/general';
import { Employee } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const FindEmployee = async (id: string | undefined, email?: string) => {
  if (email) {
    return await Employee.findOne({ email: email });
  } else {
    return await Employee.findOne({ id: id });
  }
};

export const createEmployee = async (data: CreateEmployeeInput) => {
  const {
    email,
    password,
    phoneNumber,
    firstName,
    lastName,
    gender,
    role,
    jobTitle,
    dateOfEmployment,
  } = data;

  const salt = await GenerateSalt();
  const accountPassword = await GeneratePassword(password, salt);

  const createdUser = await Employee.create({
    email,
    password: accountPassword,
    phoneNumber,
    firstName,
    salt,
    lastName,
    gender,
    role,
    jobTitle,
    dateOfEmployment,
    status: Status.DEACTIVATED,
  });

  const result = {
    id: createdUser.id,
    email,
    firstName,
    lastName,
    gender,
    role,
    phoneNumber,
    jobTitle,
    dateOfEmployment,
  };

  return result;
};

// export const updateUser = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { email, phoneNumber, firstName, lastName, gender, role } = <
//     UpdateEmployeeInput
//   >req.body;

//   const user = req.user;

//   if (user) {
//     const existingUser = await FindEmployee(user.id);

//     if (existingUser !== null) {
//       existingUser.firstName = firstName;
//       existingUser.lastName = lastName;
//       existingUser.email = email;
//       existingUser.phoneNumber = phoneNumber;
//       existingUser.gender = gender;
//       existingUser.role = role;

//       const savedResult = existingUser.save();
//       return res.json(savedResult);
//     }
//   }

//   return res.json({ message: 'User information not found' });
// };
