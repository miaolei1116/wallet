import React from "react";
import Immutable from "immutable";
import Translate from "react-translate-component";
import BalanceComponent from "../Utility/BalanceComponent";
import {RecentTransactions} from "./RecentTransactions";
import Proposals from "components/Account/Proposals";
import {ChainStore} from "gxbjs/es";
import SettingsActions from "actions/SettingsActions";
import {Link} from "react-router";
import ChainTypes from "../Utility/ChainTypes";
import BindToChainState from "../Utility/BindToChainState";
import utils from "common/utils";
import GXBDepositModal from '../Modal/GXBDepositModal';
import GXBLoyaltyPlanModal from '../Modal/GXBLoyaltyPlanModal';
import AccountImage from "./AccountImage";
import ActionSheet from "react-foundation-apps/src/action-sheet";



let logos = {
    GXS: require ('assets/bizc.jpg'),
    user: require('assets/599822481.jpg')
};

class AccountOverview extends React.Component {

    static propTypes = {
        balanceAssets: ChainTypes.ChainAssetsList,
        globalObject: ChainTypes.ChainObject.isRequired,
    };

    static defaultProps = {
        globalObject: "2.0.0"
    };

    constructor () {
        super ();
        this.state = {
            showHidden: false,
            // cun  kuan  zi chan 
            depositAsset: null,
            // shou hui zi chan 
            withdrawAsset: null
        };
    }

    shouldComponentUpdate (nextProps, nextState) {
        return (
            !utils.are_equal_shallow (nextProps.balanceAssets, this.props.balanceAssets) || !utils.are_equal_shallow (nextProps.balances, this.props.balances) ||
            nextProps.account !== this.props.account ||
            nextProps.settings !== this.props.settings ||
            nextProps.hiddenAssets !== this.props.hiddenAssets || !utils.are_equal_shallow (nextState, this.state)
        );
    }

    _hideAsset (asset, status) {
        SettingsActions.hideAsset (asset, status);
    }

    showGXBDeposit (asset) {
        this.refs['gxb-deposit-modal'].refs['bound_component'].show (asset);
    }

    showLoyaltyPlanModal (balanceObject) {
        this.refs['gxb-loyalty-program-modal'].refs['bound_component'].show (balanceObject);
    }

    // _showDepositWithdraw(action, asset, fiatModal, e) {
    //     e.preventDefault();
    //     this.setState({
    //         [action === "deposit_modal" ? "depositAsset" : "withdrawAsset"]: asset,
    //         fiatModal
    //     }, () => {
    //         this.refs[action].show();
    //     });
    // }

    _getSeparator (render) {
        return render ? <span> | </span> : null;
    }

    _onNavigate (route, e) {
        e.preventDefault ();
        this.props.router.push (route);
    }

    _renderBalances (balanceList) {
        let {settings, account} = this.props;
        let showAssetPercent = settings.get ("showAssetPercent", false);
        let balances = [];
        let programs = this.props.globalObject.getIn (['parameters', 'extensions']).find (function (arr) {
            return arr.toJS ()[0] == 6;
        });
       // console.log(balanceList,112)
        balanceList.forEach (balance => {
           // console.log(balance)
            let balanceObject = null;

            if (balance.balance_id != '2.5.-1') {
                balanceObject = ChainStore.getObject (balance.balance_id);
            }
            else {
                balanceObject = Immutable.fromJS ({
                    id: balance.balance_id, owner: account.get ('id'), asset_type: balance.asset_type, balance: "0"
                });
            }
            let asset_type = balanceObject.get ("asset_type");
           // console.log(asset_type,213)
            let asset = ChainStore.getObject (asset_type);
            // console.log(asset)
            //console.log(asset)
            let assetInfoLinks;
            let transferLink;
            if (!asset) return null;

            /* Table content */
            const assetDetailURL = `/asset/${asset.get ("symbol")}`;

            transferLink = <Link to={`/transfer?asset=${asset.get ("id")}`}><Translate
                content="transaction.trxTypes.transfer"/></Link>;

            /* Popover content */
            assetInfoLinks = (
                <ul>
                    <li><a 
                        href={assetDetailURL} 
                        onClick={this._onNavigate.bind (this, assetDetailURL)}>
                        <Translate
                        content="account.asset_details"/>
                        </a></li>
                </ul>);

            const hasBalance = !!balanceObject.get ("balance") && balance.balance_id != '2.5.-1';
           //console.log(balances)
            balances.push (
                <div key={asset.get ('symbol')} className="grid-content" style={{height:"100%"}}>
                    <div className="grid-content" style={{height:"100%"}}>
                        {/*<h4 className="title text-center">{asset.get ('symbol')}</h4>*/}
                        <div className="grid-block vertical" style={{height:"100%"}}>
                            <div className="grid-block align-center">
                                {logos[asset.get ('symbol')] ?
                                    <img style={{width: '5rem', height: '5rem',position:"relative",top:"1rem"}}
                                         src={`${logos[asset.get ('symbol')]}`}></img> :
                                    <AccountImage size={{width: 35, height: 35}} account={asset.get ('symbol')}/>}
                            </div>
                            {/*{programs && asset_type == '1.3.1' && this.props.isMyAccount ?
                                <a onClick={this.showLoyaltyPlanModal.bind (this, balanceObject)}
                                   className="btn-loyalty-program"><Translate
                                    content="loyalty_program.join"/></a> : null}*/}
                            <div className="grid-content">
                                <div className="grid-block align-center vertical">
                                    {hasBalance ? <div className="grid-block align-center" style={{fontSize:"2.3rem"}}><BalanceComponent balance={balanceObject.get ('id')} assetInfo={assetInfoLinks}/></div> :
                                                <div className="grid-block align-center"><BalanceComponent amount={0} asset_type={asset.get ('symbol')} assetInfo={assetInfoLinks}/></div>}
                                    <div style={{textAlign:"center",paddingTop:"1rem"}}>   
                                        <a className="success button" href="#" style={{padding:"0.5rem 1rem"}}>充值</a>
                                    </div>
                                </div>
                                {/*<table className="table key-value-table">
                                    <tbody className="grid-block vertical">
                                        <tr className="grid-block align-center" style={{fontSize:"3rem"}}>
                                            <td><Translate content="account.asset"/></td>
                                            <td>
                                                {hasBalance ? <BalanceComponent balance={balanceObject.get ('id')}
                                                                                    assetInfo={assetInfoLinks}/> :
                                                    <BalanceComponent amount={0} asset_type={asset.get ('symbol')}
                                                                      assetInfo={assetInfoLinks}/>}
                                                    <div style={{textAlign:"center",paddingTop:"1rem"}}>   
                                                        <a className="success button" href="#" style={{padding:"0.5rem 1rem"}}>充值</a>
                                                    </div>
                                            </td>
                                        </tr>
                                        <tr className="grid-block align-center" style={{backgroundColor:"rgba(68,76,100,.886)",paddingTop:"1rem"}}>
                                            <td><Translate content="account.transfer_actions"/></td>
                                            <td>
                                                {hasBalance ? transferLink : null}
                                               
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>*/}
                            </div>
                        </div>
                    </div>
                    {/*<tr key={asset.get("symbol")} style={{maxWidth: "100rem"}}>
                     <td style={{textAlign: "left"}}>
                     {hasBalance ? <BalanceComponent balance={balance.balance_id} assetInfo={assetInfoLinks}/> : null}
                     </td>
                     // <td style={{textAlign: "right"}} className="column-hide-small">
                     //     {hasBalance ? <BalanceValueComponent balance={balance.balance_id} toAsset={preferredUnit}/> : null}
                     // </td>
                     <td style={{textAlign: "center"}}>
                     {transferLink}
                     {this.props.isMyAccount ? (
                     <span>
                     {this._getSeparator(hasBalance)}
                     <a onClick={this.showGXBDeposit.bind(this,asset)}>
                     <Translate content="gateway.deposit"/>
                     </a>
                     </span>
                     ) : null}
                     // this.props.isMyAccount&&canWithdraw? (
                     //  <span>
                     //  {this._getSeparator(true)}
                     //  <a onClick={this._showDepositWithdraw.bind(this, "withdraw_modal", assetName, false)}>
                     //  <Translate content="modal.withdraw.submit" />
                     //  </a>
                     //  </span>
                     //  ) : null
                     </td>

                     <td style={{textAlign: "center"}} className="column-hide-small" data-place="bottom"
                     data-tip={counterpart.translate("tooltip." + (includeAsset ? "hide_asset" : "show_asset"))}>
                     <a style={{marginRight: 0}} className={includeAsset ? "order-cancel" : "action-plus"}
                     onClick={this._hideAsset.bind(this, asset_type, includeAsset)}>
                     <Icon name={includeAsset ? "cross-circle" : "plus-circle"} className="icon-14px"/>
                     </a>
                     </td>
                     </tr>*/}
                </div>
            );
          // console.log(balances)
        });

        function sortAlphabetic (a, b) {
            if (a.key > b.key) return 1;
            if (a.key < b.key) return -1;
            return 0;
        };

        balances.sort (sortAlphabetic);
        return {balances};
    }

    _toggleHiddenAssets () {
        this.setState ({
            showHidden: !this.state.showHidden
        });
    }
    _transferAccount (e){
        // console.log(this.refs)
        // console.log(e.target.value)
        // if(e.target.value === "转账") {
        //     let transferA = <Link to={`/transfer/?to=${this.props.params.account_name}`} style={{fontSize:"1.2rem",color:"#eee"}}>转账</Link>
        //     transferA.onclick = function(){}
        //     transferA.click(); 
        //     console.log(transferA)
        // }
    }
    render () {
        let {account, hiddenAssets} = this.props;
        //console.log(account.get("balances"))
        if (!account) {
            return null;
        }

        let includedBalances, hiddenBalances;
        let account_balances = account.get ("balances") || new Immutable.Map ();
        //console.log(account.get("balances"),1111)
        if (!account_balances.has ('1.3.0')) {
            account_balances = account_balances.merge ({
                '1.3.0': '2.5.-1'
            });
        }
        if (!account_balances.has ('1.3.1')) {
            account_balances = account_balances.merge ({
                '1.3.1': '2.5.-1'
            });
        }

        let includedBalancesList = Immutable.List (), hiddenBalancesList = Immutable.List ();
       // console.log(Immutable,333)
       // console.log(includedBalancesList,222);
        if (account_balances) {
            // Filter out balance objects that have 0 balance or are not included in open orders
            // account_balances = account_balances.filter((a, index) => {
            // let balanceObject = ChainStore.getObject(a);
            // if (balanceObject && (!balanceObject.get("balance") && !orders[index])) {
            //     return false;
            // } else {
            //     return true;
            // }
            // return true;
            // });

            // 将余额隐藏起来，包括在内。
            // Separate balances into hidden and included
            account_balances.forEach ((a, asset_type) => {
                if (hiddenAssets.includes (asset_type)) {
                    hiddenBalancesList = hiddenBalancesList.push ({asset_type: asset_type, balance_id: a});
                } else {
                    includedBalancesList = includedBalancesList.push ({asset_type: asset_type, balance_id: a});
                    //console.log(includedBalancesList)
                }
            });

            let included = this._renderBalances (includedBalancesList, true);
            includedBalances = included.balances;
        }  
        
        return (
            <div className="grid-block">
                <div className="grid-content" style={{overflowX: "hidden"}}>
                    <div className="grid-block medium-12 align-center" style={{color:"#eee",marginBottom:"1rem"}}>
                        <div className="grid-block medium-5" style={{borderRadius:"1rem",height:"15rem",marginBottom:"1rem",backgroundColor:"rgba(68,76,100)",marginRight:"1rem",marginLeft:"0rem"}}>
                            <div className="generic-bordered-box medium-12">
                                {/*<div className="block-content-header" style={{position: "relative"}}>
                                    <Translate content="transfer.balances"/>
                                </div>*/}
                                <div className="grid-content">
                                    <div className="grid-block" style={{height:"15rem"}}>
                                        <div className="grid-content medium-6" style={{display:"table",height:"15rem"}}>
                                            <div className="grid-content" style={{display:"table-cell",verticalAlign:"middle",borderRadius:"50%",textAlign:"center"}}>
                                               {/*<img src="favicon.ico" alt="" style={{width:"8rem"}}/>*/}
                                               <AccountImage image={logos.user}/>
                                            </div>
                                        </div>
                                        <div className="grid-content medium-6" style={{height:"15rem",textAlign:"left",paddingTop:"3rem"}}>
                                            <div className="medium-12" style={{fontSize:"1.6rem",fontWight:"bold",marginBottom:"4rem"}}>
                                                {this.props.params.account_name}
                                            </div>
                                            <div className="medium-12" style={{height:"2rem",width:"10rem",lineHeight:"2rem",backgroundColor:"#fff",color:"#666"}}>
                                                <select name="" id="" onClick={this._transferAccount.bind(this)} style={{width:"100%"}}>
                                                    <option value="">选择</option>
                                                    <option ref="transferA">转账</option>
                                                    <option ref="infoA">资料</option>
                                                    <option ref="voteA">投票</option>
                                                    <option ref="permissionA">权限</option>
                                                </select>
                                               {/* <ActionSheet>
                                                    <ActionSheet.Button title="">
                                                        <div style={{height:"2rem",width:"10rem",lineHeight:"2rem",backgroundColor:"#fff",color:"#666",textAlign:"center"}}>选择</div>
                                                    </ActionSheet.Button>
                                                    <ActionSheet.Content className="">
                                                        <ul>
                                                            <li>
                                                                <Link to={`/transfer/?to=${this.props.params.account_name}`} style={{fontSize:"1.2rem",color:"#eee"}}>转账</Link>
                                                            </li>
                                                            <li>
                                                                <Link to={`/transfer/?to=${this.props.params.account_name}`} style={{fontSize:"1.2rem",color:"#eee"}}>资料</Link>
                                                            </li>
                                                            <li>
                                                                <Link to={`/transfer/?to=${this.props.params.account_name}`} style={{fontSize:"1.2rem",color:"#eee"}}>投票</Link>
                                                            </li>
                                                            <li>
                                                                <Link to={`/transfer/?to=${this.props.params.account_name}`} style={{fontSize:"1.2rem",color:"#eee"}}>权限</Link>
                                                            </li>
                                                        </ul>
                                                    </ActionSheet.Content>
                                                </ActionSheet>*/}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="grid-block medium-5 align-center" style={{borderRadius:"1rem",height:"15rem",backgroundColor:"rgba(68, 76, 100)",marginBottom:"1rem",marginRight:"1rem",marginLeft:"0rem"}}>
                            <div className="generic-bordered-box medium-12">
                                {/*<div className="block-content-header" style={{position: "relative"}}>
                                    <Translate content="transfer.balances"/>
                                </div>*/}
                                <div className="grid-content" style={{height:"100%"}}>
                                    {includedBalances[1]}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*{account.get ("proposals") && account.get ("proposals").size ?
                        <div className="content-block">
                            <div className="block-content-header">
                                <Translate content="explorer.proposals.title"/>
                            </div>
                            <Proposals account={account.get ("id")}/>
                        </div> : null}*/}

                    <div className="grid-block" style={{paddingLeft:"2rem",paddingRight:"1.5rem"}}>
                        <RecentTransactions
                            accountsList={Immutable.fromJS ([account.get ("id")])}
                            compactView={false}
                            showMore={true}
                            fullHeight={true}
                            limit={10}
                            showFilters={true}
                        />
                    </div>
                </div>
                {/*<GXBDepositModal account={account} ref="gxb-deposit-modal"></GXBDepositModal>*/}
                <GXBLoyaltyPlanModal 
                account={account} 
                ref="gxb-loyalty-program-modal"/>
            </div>
        );
    }
}
AccountOverview = BindToChainState (AccountOverview);
class BalanceWrapper extends React.Component {

    static propTypes = {
        balances: ChainTypes.ChainObjectsList,
        orders: ChainTypes.ChainObjectsList
    };

    static defaultProps = {
        balances: Immutable.List (),
        orders: Immutable.List ()
    };

    componentWillMount () {

    }

    render () {
        let balanceAssets = this.props.balances.map (b => {
            return b && b.get ("asset_type");
        }).filter (b => !!b);
        if (balanceAssets.indexOf ('1.3.0') == -1) {
            balanceAssets.push ('1.3.0');
        }
        if (balanceAssets.indexOf ('1.3.1') == -1) {
            balanceAssets.push ('1.3.1');
        }

        let ordersByAsset = this.props.orders.reduce ((orders, o) => {
            let asset_id = o.getIn (["sell_price", "base", "asset_id"]);
            if (!orders[asset_id]) orders[asset_id] = 0;
            orders[asset_id] += parseInt (o.get ("for_sale"), 10);
            return orders;
        }, {});

        for (let id in ordersByAsset) {
            if (balanceAssets.indexOf (id) === -1) {
                balanceAssets.push (id);
            }
        }

        return (
            <AccountOverview 
                {...this.state} 
                {...this.props} 
                orders={ordersByAsset}
                balanceAssets={Immutable.List (balanceAssets)}
                />
        );
    };
}

export default BindToChainState (BalanceWrapper);
