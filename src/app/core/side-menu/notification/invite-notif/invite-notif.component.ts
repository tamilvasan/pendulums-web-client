import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../../../shared/state/appState';
import { UserActions } from '../../../../shared/state/user/user.actions';
import { ProjectsActions } from '../../../../shared/state/project/projects.actions';
import { NotificationService } from '../notification.service';
import { NotificationComponent } from '../notification.component';
import { Project } from '../../../../shared/state/project/project.model';
import { ErrorService } from 'app/core/error/error.service';

@Component({
  selector: 'app-invite-notif',
  templateUrl: './invite-notif.component.html',
  styleUrls: ['./invite-notif.component.sass']
})
export class InviteNotifComponent implements OnInit {
  @Input() project: Project
  pendingInvitations: Array<object>;
  denyDisabledIndex = false;
  acceptDisabledIndex = false;
  user: any;

  constructor(private userActions: UserActions,
              private projectsActions: ProjectsActions,
              private notificationService: NotificationService,
              private store: Store<AppState>,
              private errorService: ErrorService,
              private notificationComponent: NotificationComponent) { }

  ngOnInit() {
    this.user = this.notificationComponent.user
  }

  accept(projectId) {
    if (!this.acceptDisabledIndex) {
      this.acceptDisabledIndex = true;
      this.notificationService.accept(projectId).then((project) => {
        project.activities = [];
        this.store.dispatch(this.projectsActions.addProject(project));
        this.user.pendingInvitations.map((obj, index) => {
          if (obj.id === projectId) {
            this.user.pendingInvitations.splice(index, 1);
          }
        });
        this.store.dispatch(this.userActions.loadUser(this.user));
        this.acceptDisabledIndex = false;
      })
        .catch(error => {
          if (error.status === 404) {
            this.user.pendingInvitations.map((obj, index) => {
              if (obj.id === projectId) {
                this.user.pendingInvitations.splice(index, 1);
              }
            });
            this.store.dispatch(this.userActions.loadUser(this.user));
            this.acceptDisabledIndex = false;
            this.showError('The project not found!');
          } else {
            console.log('error is: ', error);
          }
        });
    }
  }

  deny(projectId) {
    if (!this.denyDisabledIndex ) {
      this.denyDisabledIndex = true;
      this.notificationService.deny(projectId).then((Id) => {
        this.user.pendingInvitations.map((obj, index) => {
          if (obj.id === projectId) {
            this.user.pendingInvitations.splice(index, 1);
          }
        });
        this.store.dispatch(this.userActions.loadUser(this.user));
        this.denyDisabledIndex = false;
      })
        .catch(error => {
          console.log('error is: ', error);
          if (error.status === 404) {
            this.user.pendingInvitations.map((obj, index) => {
              if (obj.id === projectId) {
                this.user.pendingInvitations.splice(index, 1);
              }
            });
            this.store.dispatch(this.userActions.loadUser(this.user));
            this.denyDisabledIndex = false;
          }
        });
    }
  }

  showError(error) {
    this.errorService.show({
      input: error
    });
  }
}
