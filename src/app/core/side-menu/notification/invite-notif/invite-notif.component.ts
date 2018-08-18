import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/state/appState';
import { UserActions } from '../../../../shared/state/user/user.actions';
import { ProjectsActions } from '../../../../shared/state/project/projects.actions';
import { NotificationService } from '../notification.service';
import { NotificationComponent } from '../notification.component';

@Component({
  selector: 'app-invite-notif',
  templateUrl: './invite-notif.component.html',
  styleUrls: ['./invite-notif.component.sass']
})
export class InviteNotifComponent implements OnInit {
  pendingInvitations: Array<object>;
  denyDisabledIndex = -1;
  acceptDisabledIndex = -1;
  user: any;
  haveUpdate: boolean;

  constructor(private userActions: UserActions,
              private projectsActions: ProjectsActions,
              private notificationService: NotificationService,
              private store: Store<AppState>,
              private notificationComponent: NotificationComponent) { }

  ngOnInit() {
    this.user = this.notificationComponent.user
    this.haveUpdate = this.notificationComponent.isUpdateAvalable;
    this.pendingInvitations = this.notificationComponent.pendingInvitations
  }

  accept(projectId, i) {
    if (this.acceptDisabledIndex < 0 && this.denyDisabledIndex < 0) {
      this.acceptDisabledIndex = i;
      this.notificationService.accept(projectId).then((project) => {
        project.activities = [];
        this.store.dispatch(this.projectsActions.addProject(project));
        this.user.pendingInvitations.map((obj, index) => {
          if (obj.id === projectId) {
            this.user.pendingInvitations.splice(index, 1);
          }
        });
        this.store.dispatch(this.userActions.loadUser(this.user));
        this.acceptDisabledIndex = -1;
      })
        .catch(error => {
          console.log('error is: ', error);
          this.acceptDisabledIndex = -1;
        });
    }
  }

  deny(projectId, i) {
    if (this.denyDisabledIndex < 0 && this.acceptDisabledIndex < 0) {
      this.denyDisabledIndex = i;
      this.notificationService.deny(projectId).then((Id) => {
        this.user.pendingInvitations.map((obj, index) => {
          if (obj.id === projectId) {
            this.user.pendingInvitations.splice(index, 1);
          }
        });
        this.store.dispatch(this.userActions.loadUser(this.user));
        this.denyDisabledIndex = -1;
      })
        .catch(error => {
          console.log('error is: ', error);
          this.denyDisabledIndex = -1;
        });
    }
  }

}
