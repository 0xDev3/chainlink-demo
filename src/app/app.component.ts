import { Component, OnInit } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { Dev3ChainlinkSDK } from 'dev3-chainlink-sdk/lib/src/dev3-sdk'
import { RoundDataModel } from 'dev3-chainlink-sdk/lib/types/price-feeds-model';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, debounceTime, from, map, of, repeat, retry, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'chainlink-demo';

  sdk = new Dev3ChainlinkSDK("https://eth.llamarpc.com")
  provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com")
  
  addressInputForm = new FormControl('', [Validators.required])

  querySub = new BehaviorSubject("")
  query$ = this.querySub.asObservable()

  assets$ = this.query$.pipe(
    switchMap(query => {
      if(!query) { return of("error") }
      if(query.startsWith('0x') && (query.length === 42)) {
        return from(this.provider.getBalance(query)).pipe(
          map(wei => wei),
          switchMap(res => { return combineLatest(from(this.sdk.getFromOracle(this.sdk.ethFeeds.ETH_USD)), of(res)) }),
          map(([price, balance]) => {
            const normalizedBalance = ethers.utils.formatUnits(balance, 18)
            const normalizedPrice = ethers.utils.formatUnits(price.answer, 8)
            const total = ethers.utils.formatUnits(price.answer.mul(balance), 18 + 8)

            return `${normalizedBalance} ETH @ ${normalizedPrice} USD / ETH
             is $${total}` 
          })
        )
      } else {
        return of("error")
      }
    }),
  )


  fetchNetWorthClicked() {
    const value = this.addressInputForm.value
    if(!value) { return }
    this.querySub.next(value)
  }

  ngOnInit() {
    
  }
}
