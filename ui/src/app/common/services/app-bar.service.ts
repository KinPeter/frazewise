import { computed, Injectable } from '@angular/core';
import { Store } from '../../utils/store';
import { Router } from '@angular/router';

interface AppBarState {
  title: string;
  backRoute: string[];
}

const initialState: AppBarState = {
  title: '',
  backRoute: [],
};

@Injectable({ providedIn: 'root' })
export class AppBarService extends Store<AppBarState> {
  public title = computed(() => this.state().title);
  public hasBackButton = computed(() => this.state().backRoute.length > 0);

  constructor(private router: Router) {
    super(initialState);
  }

  public setTitle(title: string): void {
    this.setState({ title });
  }

  public setBackRoute(route: string[]): void {
    this.setState({ backRoute: route });
  }

  public clearBackRoute(): void {
    this.setState({ backRoute: [] });
  }

  public navigateBack(): void {
    this.router.navigate(this.state().backRoute);
  }
}
