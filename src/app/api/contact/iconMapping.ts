import { AddToPhotos, Message, Search } from '@mui/icons-material';

const iconMapping: { [key: string]: React.ElementType } = {
  home: AddToPhotos,
  search: Search,
  message: Message,
};

export default iconMapping;