'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, Button, Input, FormItem, FormContainer, Avatar, Notification as NotificationComponent } from '@/components/ui'
import { HiPencil, HiCamera } from 'react-icons/hi2'
import { useAuth } from '@/contexts/AuthContext'
import { updateUserProfile } from '@/services/auth'
import { toast } from '@/components/ui'

const profileSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  last_name: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address'),
})

type ProfileFormSchema = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, updateUserProfile: updateUserContext } = useAuth()
  const [isEditing, setIsEditing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
    },
  })

  const onSubmit = async (data: ProfileFormSchema) => {
    try {
      const updatedUser = await updateUserProfile(data)
      updateUserContext(updatedUser)
      setIsEditing(false)
      
      toast.push(
        <NotificationComponent title="Success!" type="success">
          Profile updated successfully!
        </NotificationComponent>
      )
    } catch {
      toast.push(
        <NotificationComponent title="Error" type="danger">
          Failed to update profile
        </NotificationComponent>
      )
    }
  }

  const stringToColor = (string: string): string => {
    let hash = 0
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash)
    }
    let color = '#'
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff
      color += `00${value.toString(16)}`.slice(-2)
    }
    return color
  }

  const avatarColor = user ? stringToColor(user.full_name) : '#1976d2'

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Profile Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Manage your account information
        </p>
      </div>

      {/* Profile Picture Card */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Profile Picture
          </h3>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar
                size={100}
                shape="circle"
                style={{ backgroundColor: avatarColor }}
                className="text-white font-semibold text-3xl"
                src={user?.profile_image}
              >
                {user?.first_name?.charAt(0) || 'U'}
              </Avatar>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary-mild transition-colors">
                <HiCamera className="text-lg" />
              </button>
            </div>
            <div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {user?.full_name}
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email}
              </p>
              <Button
                size="sm"
                variant="plain"
                className="mt-2"
              >
                Change Picture
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Information Card */}
      <Card>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Personal Information
            </h3>
            {!isEditing && (
              <Button
                size="sm"
                variant="plain"
                icon={<HiPencil />}
                onClick={() => setIsEditing(true)}
              >
                Edit
              </Button>
            )}
          </div>

          {isEditing ? (
            <FormContainer>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormItem
                    label="First Name"
                    invalid={!!errors.first_name}
                    errorMessage={errors.first_name?.message}
                  >
                    <Input
                      {...register('first_name')}
                      placeholder="Enter first name"
                      disabled={isSubmitting}
                    />
                  </FormItem>

                  <FormItem
                    label="Last Name"
                    invalid={!!errors.last_name}
                    errorMessage={errors.last_name?.message}
                  >
                    <Input
                      {...register('last_name')}
                      placeholder="Enter last name"
                      disabled={isSubmitting}
                    />
                  </FormItem>
                </div>

                <FormItem
                  label="Email"
                  invalid={!!errors.email}
                  errorMessage={errors.email?.message}
                >
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="Enter email"
                    disabled={isSubmitting}
                  />
                </FormItem>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="default"
                    onClick={() => setIsEditing(false)}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </FormContainer>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    First Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {user?.first_name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Last Name
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 mt-1">
                    {user?.last_name}
                  </p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <p className="text-gray-900 dark:text-gray-100 mt-1">
                  {user?.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Password Change Card */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Change Password
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Update your password to keep your account secure.
          </p>
          <Button variant="default">
            Change Password
          </Button>
        </div>
      </Card>

      {/* Account Actions Card */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Account Actions
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  Export Your Data
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Download all your contacts and requests
                </p>
              </div>
              <Button variant="default" size="sm">
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">
                  Delete Account
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="default"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}


