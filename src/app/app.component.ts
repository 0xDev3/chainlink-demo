import { Component, OnInit } from '@angular/core';
import { BigNumber, ethers } from 'ethers';
import { Dev3ChainlinkSDK } from 'dev3-chainlink-sdk/lib/src/dev3-sdk'
import { RoundDataModel } from 'dev3-chainlink-sdk/lib/types/price-feeds-model';
import { FormControl, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, combineLatest, debounceTime, from, map, Observable, of, repeat, retry, switchMap, throwError } from 'rxjs';
import { PriceFeedsETH } from 'dev3-chainlink-sdk/lib/data-feeds/ETH-data-feed'
import { PriceFeedsAVAX } from 'dev3-chainlink-sdk/lib/data-feeds/avax-data-feed'
import { PriceFeedsBSC } from 'dev3-chainlink-sdk/lib/data-feeds/bsc-data-feed'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'chainlink-demo';

  ethSDK = new Dev3ChainlinkSDK("https://eth.llamarpc.com", new PriceFeedsETH())
  avaxSDK = new Dev3ChainlinkSDK("https://endpoints.omniatech.io/v1/avax/mainnet/public", new PriceFeedsAVAX())
  bscSDK = new Dev3ChainlinkSDK("https://bsc.rpc.blxrbdn.com", new PriceFeedsBSC())

  ethFeeds$: Observable<RoundDataModel>[] = [
    from(this.ethSDK.getFromOracle(this.ethSDK.feeds.AAVE_ETH)),
    from(this.ethSDK.getFromOracle(this.ethSDK.feeds.COINBASE_BORED_APE_YACHT_CLUB_FLOOR_PRICE_ETH)),
    from(this.ethSDK.getFromOracle(this.ethSDK.feeds.ALCX_ETH)),
    from(this.ethSDK.getFromOracle(this.ethSDK.feeds.AMPL_USD)),
  ]

  avaxFeeds$: Observable<RoundDataModel>[] = [
    from(this.avaxSDK.getFromOracle(this.avaxSDK.feeds.AAPL_USD)),
    from(this.avaxSDK.getFromOracle(this.avaxSDK.feeds.NFLX_USD)),
    from(this.avaxSDK.getFromOracle(this.avaxSDK.feeds.BRL_USD)),
  ]

  bscFeeds$: Observable<RoundDataModel>[] = [
    from(this.bscSDK.getFromOracle(this.bscSDK.feeds.DAI_BNB)),
    from(this.bscSDK.getFromOracle(this.bscSDK.feeds.ADA_BNB)),
    from(this.bscSDK.getFromOracle(this.bscSDK.feeds.ARPA_USD)),
  ]

  

}
