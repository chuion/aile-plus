import Autocomplete from './lib/autocomplete'
import Avatar from './lib/avatar'
import Card from './lib/card'
import Dialog from './lib/dialog'
import Form from './lib/form'
import Input from './lib/input'
import Link from './lib/link'
import Select from './lib/select'
import Table from './lib/table'
import Tooltip from './lib/tooltip'

const AilePlus = {
  Autocomplete,
  Avatar,
  Card,
  Dialog,
  Form,
  Input,
  Link,
  Select,
  Table,
  Tooltip
}

const install = (app, option = {}) => {
  Object.keys(AilePlus).forEach(name => {
    AilePlus[name].install(app, option[name.toLowerCase()] || {})
  })
}

export default {
  ...AilePlus,
  install
}
