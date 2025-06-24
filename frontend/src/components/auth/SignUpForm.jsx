import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { axiosInstance } from '../../lib/axios.js';
import { toast } from 'react-hot-toast';
import { Loader } from 'lucide-react';
import axios from 'axios';

const SignUpForm = () => {
  const [signUpData, setSignUpData] = useState({
    name: '',
    email: '',
    userName: '',
    password: '',
  });

  // const queryClient = useQueryClient();

  const { mutate: signUpMutation, isLoading } = useMutation({
    mutationFn: async (data) => {
      const res = await axios.post('/api/v1/auth/register', data);
      return res.data;
    },
    onSuccess: () => {
      toast.success('Account created successfully');
      // queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
    onError: (err) => {
      toast.error(err.response.data.message || 'Something went wrong');
    },
  });

  const handleSignUp = (e) => {
    e.preventDefault();
    signUpMutation(signUpData);
  };

  return (
    <div className='card w-96 bg-base-100 shadow-xl'>
      <div className='card-body'>
        <h2 className='card-title mb-4'>Create New Account</h2>
        <form onSubmit={handleSignUp} className='flex flex-col gap-4'>
          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Full Name</span>
            </label>
            <input
              type='text'
              placeholder='John Doe'
              value={signUpData.name}
              onChange={(e) =>
                setSignUpData({ ...signUpData, name: e.target.value })
              }
              className='input input-bordered'
              required
            />
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Username</span>
            </label>
            <input
              type='text'
              placeholder='johndoe123'
              value={signUpData.userName}
              onChange={(e) =>
                setSignUpData({ ...signUpData, userName: e.target.value })
              }
              className='input input-bordered'
              required
            />
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Email</span>
            </label>
            <input
              type='email'
              placeholder='john@example.com'
              value={signUpData.email}
              onChange={(e) =>
                setSignUpData({ ...signUpData, email: e.target.value })
              }
              className='input input-bordered'
              required
            />
          </div>

          <div className='form-control'>
            <label className='label'>
              <span className='label-text'>Password</span>
            </label>
            <input
              type='password'
              placeholder='••••••••'
              value={signUpData.password}
              onChange={(e) =>
                setSignUpData({ ...signUpData, password: e.target.value })
              }
              className='input input-bordered'
              required
            />
          </div>

          <div className='form-control mt-6'>
            <button
              type='submit'
              disabled={isLoading}
              className='btn btn-primary'
            >
              {isLoading ? (
                <Loader className='size-5 animate-spin' />
              ) : (
                'Agree & Join'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default SignUpForm;
