export class Menu {
  state: string;
  name: string;
  type?: 'link' | 'sub';
  icon?: string;
  children?: Menu[];
}
