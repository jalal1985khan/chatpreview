// DraggableComponents.js
import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

export const WelcomeMessage = () => (
  <span className="border border-gray-200">How can i Help ?</span>
)

export const TextArea = () => <Textarea className="bg-white" />

export const SelectComponent = () => (
  <Select className="w-full bg-white">
    <SelectTrigger className="w-full bg-white">
      <SelectValue placeholder="Theme" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="light">Light</SelectItem>
      <SelectItem value="dark">Dark</SelectItem>
      <SelectItem value="system">System</SelectItem>
    </SelectContent>
  </Select>
)

export const TextInput = () => <Input className="bg-white" />

export const ButtonComponent = () => (
  <Button className="w-full bg-blue-700">Button</Button>
)

export const ImageInput = () => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    {/* <Label htmlFor="picture">Picture</Label> */}
    <Input id="picture" type="file" className="bg-white" />
  </div>
)
