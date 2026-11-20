import {Component} from '@angular/core';
import {Router} from '@angular/router';

import {SessionService} from '../../core/session.service';
import {MenuItem, MenuItemsService} from '../../menu-items.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  menu: MenuItem[] = [];
  constructor(public routing: Router, public menuItems: MenuItemsService, public session: SessionService) {
   this.menu = this.session.user.rol.menu;
  }

  async logout(): Promise<void> {
    this.menuItems.menu = new Array<MenuItem>();
    this.session.logout();
    await this.routing.navigateByUrl('/session');
  }
}
