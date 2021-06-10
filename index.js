import Autocomplete from './lib/autocomplete';
import Avatar from './lib/avatar';
import Card from './lib/card';
import Dialog from './lib/dialog';
import Form from './lib/form';
import Input from './lib/input';
import Link from './lib/link';
import Placement from './lib/placement';
import Select from './lib/select';
import Table from './lib/table';
import Tooltip from './lib/tooltip';

const AileUI = {
  autocomplete: Autocomplete,
  avatar: Avatar,
  card: Card,
  dialog: Dialog,
  form: Form,
  input: Input,
  link: Link,
  placement: Placement,
  select: Select,
  table: Table,
  tooltip: Tooltip
};

const install = (app, option = {}) => {
  for (const name in AileUI) {
    if ({}.hasOwnProperty.call(AileUI, name)) {
      AileUI[name].install(app, option[name] || {});
    }
  }
};

export default {
  ...AileUI,
  install
};
