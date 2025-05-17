import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TUser } from '../../../../user/types/user.type';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() public identity: Partial<TUser> | undefined;
}
