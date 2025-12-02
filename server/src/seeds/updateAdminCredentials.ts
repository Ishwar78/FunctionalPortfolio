import 'dotenv/config';
import { connectDB, disconnectDB } from '../config/database';
import { AdminUser } from '../models/AdminUser';
import { hashPassword } from '../utils/password';

const updateAdminCredentials = async () => {
  try {
    await connectDB();
    console.log('Updating admin credentials...');

    const newEmail = 'IshwarAdmin@123456';
    const newPassword = 'Ishwar@2002';

    const passwordHash = await hashPassword(newPassword);

    const result = await AdminUser.findOneAndUpdate(
      { role: 'owner' },
      {
        email: newEmail,
        passwordHash: passwordHash,
      },
      { new: true }
    );

    if (result) {
      console.log('✓ Admin credentials updated successfully!');
      console.log(`  Email: ${result.email}`);
      console.log(`  Role: ${result.role}`);
    } else {
      console.log('No admin user found. Creating new admin user...');
      const newAdmin = new AdminUser({
        email: newEmail,
        passwordHash: passwordHash,
        role: 'owner',
      });
      await newAdmin.save();
      console.log('✓ New admin user created successfully!');
      console.log(`  Email: ${newAdmin.email}`);
    }
  } catch (error) {
    console.error('Error updating admin credentials:', error);
  } finally {
    await disconnectDB();
  }
};

updateAdminCredentials();
