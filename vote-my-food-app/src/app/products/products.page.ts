import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { BehaviorSubject, interval, map, Subject } from 'rxjs';
import { MachineProduct, VoteEnum } from './machine-product.model';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-products-page',
  templateUrl: './products.page.html',
  styleUrls: ['./products.page.scss'],
})
export class ProductsPage implements OnInit, OnDestroy, AfterViewInit {
  filteredMachineProducts$ = new BehaviorSubject<MachineProduct[]>([]);
  machineProducts: MachineProduct[] = [];
  subscription: any;
  moveOutWidth: number | undefined;
  shiftRequired: boolean = false;
  transitionInProgress: boolean = false;
  heartVisible: boolean = false;
  crossVisible: boolean = false;

  private destroy$ = new Subject<void>();

  @ViewChildren('productsCard')
  productsCard!: QueryList<ElementRef>;
  productsCardArray: Array<ElementRef> = [];
  interval$ = interval(5000);
  errorMessage = '';

  private CATEGORY_FILTER = 'Hauptspeisen - Mains';

  @ViewChild('productsCardImage')
  productsCardImage!: ElementRef;

  constructor(
    private renderer: Renderer2,
    //private store: Store<AppState>,
    private apiService: ApiService
  ) {
    /*  this.store.dispatch(loadProducts());
    this.store.pipe(select(getProducts), takeUntil(this.destroy$)).subscribe((resp: any) => {
      this.filteredMachineProducts$.next(resp.products);
    }); */

    this.loadProducts();
  }

  ngOnInit() {
    if (!localStorage.getItem('votedItems')) {
      localStorage.setItem('votedItems', JSON.stringify([]));
    }

    interval(5000).subscribe(() => {
      // make a request to your endpoint
      this.loadProducts();
    });
  }

  ngAfterViewInit() {
    this.moveOutWidth = document.documentElement.clientWidth * 1.5;
    this.productsCardArray = this.productsCard.toArray();
    this.productsCard.changes.subscribe(() => {
      this.productsCardArray = this.productsCard.toArray();
    });
  }

  trackByFn(index: number, item: any) {
    // return a unique identifier for the item
    return item.id;
  }

  loadProducts() {
    this.apiService
      .getProducts()
      .pipe(
        map((resp) =>
          resp.data.machineProducts.filter((product) =>
            product.category.name.includes(this.CATEGORY_FILTER)
          )
        )
      )
      .subscribe((resp) => {
        if (!this.getReviewedItems(resp)) {
          localStorage.setItem('products', JSON.stringify(resp))
        } else {
          this.errorMessage = "You have reviewed everything!"
        }
      }
      );

    this.filteredMachineProducts$.next(
      JSON.parse(localStorage.getItem('products') || '{}')
    );
  }

  getReviewedItems(data: MachineProduct[]) {
    const reviewedItems = JSON.parse(localStorage.getItem('votedItems') || '{}');
    return data.some(obj1 => reviewedItems.some((obj2: any) => obj1.id === obj2.id));
  }

  setOpacity() {
    this.renderer.setStyle(
      this.productsCardImage.nativeElement,
      'opacity',
      '1'
    );
  }

  getLength() {
    return this.filteredMachineProducts$ &&
      this.filteredMachineProducts$.getValue()
      ? this.filteredMachineProducts$.getValue().length
      : 0;
  }

  userClickedButton(event: { preventDefault: () => void }, heart: boolean) {
    event.preventDefault();
    if (!this.filteredMachineProducts$.getValue().length) return;
    if (heart) {
      this.renderer.setStyle(
        this.productsCardArray[0].nativeElement,
        'transform',
        'translate(' + this.moveOutWidth + 'px, -100px) rotate(-30deg)'
      );
      this.toggleChoiceIndicator(false, true);
      this.voteItem(this.filteredMachineProducts$.getValue()[0], VoteEnum.LIKE);
      //this.store.dispatch(removeItem());
      //this.store.dispatch(addVotedItem({object: this.addItem(this.filteredMachineProducts$.getValue()[0], VoteEnum.LIKE)}));
    } else {
      this.renderer.setStyle(
        this.productsCardArray[0].nativeElement,
        'transform',
        'translate(-' + this.moveOutWidth + 'px, -100px) rotate(30deg)'
      );
      this.toggleChoiceIndicator(true, false);
      this.voteItem(
        this.filteredMachineProducts$.getValue()[0],
        VoteEnum.DISLIKE
      );
      this.voteItem(
        this.filteredMachineProducts$.getValue()[0],
        VoteEnum.DISLIKE
      );
      //this.store.dispatch(addVotedItem({object: this.addItem(this.filteredMachineProducts$.getValue()[0], VoteEnum.DISLIKE)}));
    }
    this.shiftRequired = true;
    this.transitionInProgress = true;
  }

  handlePan(event: any) {
    if (
      event.deltaX === 0 ||
      (event.center.x === 0 && event.center.y === 0) ||
      !this.filteredMachineProducts$.getValue().length
    )
      return;

    if (this.transitionInProgress) {
      this.handleShift();
    }

    this.renderer.addClass(this.productsCardArray[0].nativeElement, 'moving');

    if (event.deltaX > 0) {
      this.toggleChoiceIndicator(false, true);
    }
    if (event.deltaX < 0) {
      this.toggleChoiceIndicator(true, false);
    }

    let xMulti = event.deltaX * 0.03;
    let yMulti = event.deltaY / 80;
    let rotate = xMulti * yMulti;

    this.renderer.setStyle(
      this.productsCardArray[0].nativeElement,
      'transform',
      'translate(' +
        event.deltaX +
        'px, ' +
        event.deltaY +
        'px) rotate(' +
        rotate +
        'deg)'
    );

    this.shiftRequired = true;
  }

  handlePanEnd(event: any) {
    this.toggleChoiceIndicator(false, false);

    if (!this.filteredMachineProducts$.getValue().length) return;

    this.renderer.removeClass(
      this.productsCardArray[0].nativeElement,
      'moving'
    );

    let keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;
    if (keep) {
      this.renderer.setStyle(
        this.productsCardArray[0].nativeElement,
        'transform',
        ''
      );
      this.shiftRequired = false;
    } else {
      let endX, toX, endY, toY, rotate;

      if (this.moveOutWidth) {
        endX = Math.max(
          Math.abs(event.velocityX) * this.moveOutWidth,
          this.moveOutWidth
        );
        toX = event.deltaX > 0 ? endX : -endX;
        endY = Math.abs(event.velocityY) * this.moveOutWidth;
        toY = event.deltaY > 0 ? endY : -endY;
        let xMulti = event.deltaX * 0.03;
        let yMulti = event.deltaY / 80;
        rotate = xMulti * yMulti;
      }

      this.renderer.setStyle(
        this.productsCardArray[0].nativeElement,
        'transform',
        'translate(' +
          toX +
          'px, ' +
          (toY + event.deltaY) +
          'px) rotate(' +
          rotate +
          'deg)'
      );

      this.shiftRequired = true;

      this.voteItem(
        this.filteredMachineProducts$.getValue()[0],
        VoteEnum.DISLIKE
      );
    }
    this.transitionInProgress = true;
  }

  toggleChoiceIndicator(cross: boolean, heart: boolean) {
    this.crossVisible = cross;
    this.heartVisible = heart;
  }

  handleShift() {
    this.transitionInProgress = false;
    this.toggleChoiceIndicator(false, false);
    if (this.shiftRequired) {
      this.shiftRequired = false;
      //this.store.dispatch(removeItem());
      this.filteredMachineProducts$.getValue().shift();
    }
  }

  voteItem(item: MachineProduct, vote: VoteEnum) {
    let items = JSON.parse(localStorage.getItem('products') || '{}');

    for (let i = 0; i < items.length; i++) {
      if (items[i].id === item.id) {
        items.splice(i, 1);
      }
    }
    localStorage.setItem('products', JSON.stringify(items));

    let votedItems = JSON.parse(localStorage.getItem('votedItems') || '{}');
    const newObj = {
      id: item.id,
      name: item.name,
      imageSet: item.imageSet[0].url,
      shortDescription: item.shortDescription,
      vote: vote,
    };

    if (votedItems) {
      const votedItemExists = votedItems.some(
        (obj: any) => obj.id === newObj.id
      );
      this.setNewObj(votedItemExists, votedItems, newObj, vote);
    } else {
      votedItems.push(newObj);
    }

    localStorage.setItem('votedItems', JSON.stringify(votedItems));
  }

  private setNewObj(
    votedItemExists: any,
    votedItems: any,
    newObj: {
      id: string;
      name: string;
      shortDescription: string;
      vote: VoteEnum;
    },
    vote: VoteEnum
  ) {
    if (!votedItemExists) {
      votedItems.push(newObj);
    } else {
      const index = votedItems.findIndex(
        (element: any) => element.id === newObj.id
      );
      if (index !== -1) {
        votedItems[index].vote = vote;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
