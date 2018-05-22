import React from "react";
import {Link} from "react-router/es";
import {connect} from "alt-react";
import ActionSheet from "react-foundation-apps/src/action-sheet";
import AccountActions from "actions/AccountActions";
import AccountStore from "stores/AccountStore";
import SettingsStore from "stores/SettingsStore";
import ZfApi from "react-foundation-apps/src/utils/foundation-api";
import Icon from "../Icon/Icon";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import WalletDb from "stores/WalletDb";
import WalletUnlockStore from "stores/WalletUnlockStore";
import WalletUnlockActions from "actions/WalletUnlockActions";
import WalletManagerStore from "stores/WalletManagerStore";
import cnames from "classnames";
import TotalBalanceValue from "../Utility/TotalBalanceValue";
import ReactTooltip from "react-tooltip";
import IntlActions from "actions/IntlActions";
import {Apis} from "gxbjs-ws";
import notify from "actions/NotificationActions";
import AccountImage from '../Account/AccountImage';

var logo = require("assets/images/logo.png");

const FlagImage = ({flag, width = 20, height = 20}) => {
    return <img height={height} width={width} src={"language-dropdown/" + flag.toUpperCase() + ".png"}/>;
};

class Header extends React.Component {

    static contextTypes = {
        location: React.PropTypes.object.isRequired,
        router: React.PropTypes.object.isRequired
    };

    constructor(props, context) {
        super();
        this.state = {
            active: context.location.pathname
        };

        this.unlisten = null;
    }

    componentWillMount() {
        this.unlisten = this.context.router.listen((newState, err) => {
            if (!err) {
                if (this.unlisten && this.state.active !== newState.pathname) {
                    this.setState({
                        active: newState.pathname
                    });
                }
            }
        });
    }

    componentDidMount() {
        setTimeout(() => {
            ReactTooltip.rebuild();
        }, 1250);
    }

    componentWillUnmount() {
        if (this.unlisten) {
            this.unlisten();
            this.unlisten = null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.linkedAccounts !== this.props.linkedAccounts ||
            nextProps.currentAccount !== this.props.currentAccount ||
            nextProps.locked !== this.props.locked ||
            nextProps.current_wallet !== this.props.current_wallet ||
            nextProps.lastMarket !== this.props.lastMarket ||
            nextProps.starredAccounts !== this.props.starredAccounts ||
            nextProps.currentLocale !== this.props.currentLocale ||
            nextState.active !== this.state.active
        );
    }

    _triggerMenu(e) {
        e.preventDefault();
        ZfApi.publish("mobile-menu", "toggle");
    }

    _toggleLock(e) {
        e.preventDefault();
        if (WalletDb.isLocked()) WalletUnlockActions.unlock();
        else WalletUnlockActions.lock();
    }

    _onNavigate(route, e) {
        e.preventDefault();
        this.context.router.push(route);
    }

    _onGoBack(e) {
        e.preventDefault();
        window.history.back();
    }

    _onGoForward(e) {
        e.preventDefault();
        window.history.forward();
    }

    _accountClickHandler(account_name, e) {
        e.preventDefault();
        ZfApi.publish("account_drop_down", "close");
        if (this.context.location.pathname.indexOf("/account/") !== -1) {
            let currentPath = this.context.location.pathname.split("/");
            currentPath[2] = account_name;
            this.context.router.push(currentPath.join("/"));
        }
        if (account_name !== this.props.currentAccount) {
            AccountActions.setCurrentAccount.defer(account_name);
            notify.addNotification({
                message: counterpart.translate("header.account_notify", {account: account_name}),
                level: "success",
                autoDismiss: 3
            });
        }
        // this.onClickUser(account_name, e);
    }

    // onClickUser(account, e) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //
    //     this.context.router.push(`/account/${account}/overview`);
    // }

    render() {
        let {active} = this.state;
        let {currentAccount, starredAccounts} = this.props;
        let locked_tip = counterpart.translate("header.locked_tip");
        let unlocked_tip = counterpart.translate("header.unlocked_tip");

        let tradingAccounts = AccountStore.getMyAccounts();
        let myAccountCount = tradingAccounts.length;

        if (starredAccounts.size) {
            for (let i = tradingAccounts.length - 1; i >= 0; i--) {
                if (!starredAccounts.has(tradingAccounts[i])) {
                    tradingAccounts.splice(i, 1);
                }
            }
            ;
            starredAccounts.forEach(account => {
                if (tradingAccounts.indexOf(account.name) === -1) {
                    tradingAccounts.push(account.name);
                }
            });
        }


        let myAccounts = AccountStore.getMyAccounts();
        let walletBalance = myAccounts.length && this.props.currentAccount ? (
            <div className="grp-menu-item header-balance">
                <a><TotalBalanceValue.AccountWrapper label="exchange.balance" accounts={[this.props.currentAccount]}
                                                     inHeader={true}/></a>
            </div>) : null;

        let dashboard = (
            <a
                style={{paddingTop: 12, paddingBottom: 12}}
                className={cnames({active: active === "/" || active.indexOf("dashboard") !== -1})}
                onClick={this._onNavigate.bind(this, '/')}
            >
                <img style={{margin: 0, height: 40}} src={logo}/>
            </a>
        );

        let createAccountLink = myAccountCount === 0 ? (
            <ActionSheet.Button title="" setActiveState={() => {
            }}>
                <a className="button create-account" onClick={this._onNavigate.bind(this, "/create-account")}
                   style={{padding: "1rem", border: "none"}}>
                    <Icon className="icon-14px" name="user"/> <Translate content="header.create_account"/>
                </a>
            </ActionSheet.Button>
        ) : null;

        let lock_unlock = (this.props.current_wallet && myAccountCount) ? (
            <div className="grp-menu-item">
                {this.props.locked ?
                    <a style={{padding: "1rem"}} href onClick={this._toggleLock.bind(this)} data-class="unlock-tooltip"
                       data-offset="{'left': 50}" data-tip={locked_tip} data-place="bottom" data-html><Icon
                        className="icon-14px" name="locked"/></a>
                    :
                    <a style={{padding: "1rem"}} href onClick={this._toggleLock.bind(this)} data-class="unlock-tooltip"
                       data-offset="{'left': 50}" data-tip={unlocked_tip} data-place="bottom" data-html><Icon
                        className="icon-14px" name="unlocked"/></a>}
            </div>
        ) : null;

        // Account selector: Only active inside the exchange
        let accountsDropDown = null, account_display_name, accountsList;

        if (currentAccount) {
            account_display_name = currentAccount.length > 20 ? `${currentAccount.slice(0, 20)}..` : currentAccount;
            if (tradingAccounts.indexOf(currentAccount) < 0) {
                tradingAccounts.push(currentAccount);
            }

            if (tradingAccounts.length >= 1) {
                accountsList = tradingAccounts
                    .sort()
                    .map((name, index) => {
                        return (
                            <li className={name === account_display_name ? "current-account" : ""} key={name}>
                                <a href onClick={this._accountClickHandler.bind(this, name)}>
                                    <span>{name}</span>
                                </a>
                            </li>
                        );
                    });
            }
        }

        accountsDropDown = createAccountLink ?
            createAccountLink :
            tradingAccounts.length === 1 ?
                (<ActionSheet.Button title="" setActiveState={() => {
                    }}>
                        <a onClick={this._accountClickHandler.bind(this, account_display_name)}
                           style={{cursor: "default", padding: "1rem", border: "none"}} className="button">
                            <table>
                                <tbody>
                                <tr>
                                    <td>
                                        <AccountImage style={{display: "inline-block"}}
                                                      size={{height: 20, width: 20}}
                                                      account={account_display_name}/>
                                    </td>
                                    <td>
                                        &nbsp;&nbsp;<span
                                        style={{display: "inline-block"}}>{account_display_name}</span>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </a>
                    </ActionSheet.Button>
                ) :

                (
                    <ActionSheet>
                        <ActionSheet.Button title="">
                            <a style={{padding: "1rem", border: "none"}} className="button">
                                <table>
                                    <tbody>
                                    <tr>
                                        <td>
                                            <AccountImage style={{display: "inline-block"}}
                                                          size={{height: 20, width: 20}}
                                                          account={account_display_name}/>
                                        </td>
                                        <td>
                                            &nbsp;&nbsp;<span
                                            style={{display: "inline-block"}}>{account_display_name}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </a>
                        </ActionSheet.Button>
                        {tradingAccounts.length > 1 ?
                            <ActionSheet.Content>
                                <ul className="no-first-element-top-border">
                                    {accountsList}
                                </ul>
                            </ActionSheet.Content> : null}
                    </ActionSheet>
                );

        let settingsDropdown =
            <a style={{padding: "1rem", border: "none"}} className="button"
               onClick={this._onNavigate.bind(this, "/settings")}>
                <Icon className="icon-14px" name="cog"/>
            </a>
        {/*<ActionSheet>
         <ActionSheet.Button title="">
         <a style={{padding: "1rem", border: "none"}} className="button">
         <Icon className="icon-14px" name="cog"/>
         </a>
         </ActionSheet.Button>
         <ActionSheet.Content>
         <ul className="no-first-element-top-border">
         <li>
         <a href onClick={this._onNavigate.bind(this, "/settings")}>
         <span><Translate content="header.settings"/></span>
         </a>
         </li>
         </ul>
         </ActionSheet.Content>
         </ActionSheet>*/
        }

        const flagDropdown = <ActionSheet>
            <ActionSheet.Button title="">
                <a style={{padding: "1rem", border: "none"}} className="button">
                    <FlagImage flag={this.props.currentLocale}/>
                </a>
            </ActionSheet.Button>
            <ActionSheet.Content>
                <ul className="no-first-element-top-border">
                    {this.props.locales.map(locale => {
                        return (
                            <li key={locale}>
                                <a href onClick={(e) => {
                                    e.preventDefault();
                                    IntlActions.switchLocale(locale);
                                }}>
                                    <div className="table-cell"><FlagImage flag={locale}/></div>
                                    <div className="table-cell" style={{paddingLeft: 10}}><Translate
                                        content={"languages." + locale}/></div>
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </ActionSheet.Content>
        </ActionSheet>;


        return (
            <div className="" style={{position:"relative",paddingLeft:"4rem",marginBottom:2,backgroundColor:"rgba(51,57,68,1)",boxSizing:"borderBox"}}>
                <div className="clientBack" style={{fontSize:"1.2rem",fontWeight:"blod",textAlign:"left",marginBottom:0,lineHeight:"2rem",height:"2rem"}}>
                    <div className="show-for-small-only medium-2"  style={{position:"absolute",left:0,top:0,borderRight:"1px solid #FFF"}}>
                        <ul className="primary menu-bar title" style={{overflow:"hidden"}}>
                            <li><a style={{padding:0,overflow:"hidden",backgroundColor:"rgba(51,57,68,1)"}} onClick={this._triggerMenu}><Icon className="icon-32px" name="menu"/></a></li>
                        </ul>
                    </div>
                    <Link className="medium-4" to="/" style={{display:"inline-block", height:"100%"}}> Bizchain 客户端 </Link>
                </div>
                {/*{__ELECTRON__ ? <div className="grid-block show-for-medium shrink electron-navigation">
                    <ul className="menu-bar">
                        <li>
                            <div style={{marginLeft: "1rem", height: "3rem"}}>
                                <div style={{marginTop: "0.5rem"}} onClick={this._onGoBack.bind(this)}
                                     className="button outline small">{"<"}</div>
                            </div>
                        </li>
                        <li>
                            <div style={{height: "3rem", marginLeft: "0.5rem", marginRight: "0.75rem"}}>
                                <div style={{marginTop: "0.5rem"}} onClick={this._onGoForward.bind(this)}
                                     className="button outline small">>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div> : null}
                {/*<div className="grid-block show-for-medium">
                    <ul className="menu-bar">
                        {__ELECTRON__ ? <li className="logo-li">{dashboard}</li> :
                            <li className="logo-li no-left-border">{dashboard}</li>}
                        {!currentAccount ? null : <li><Link to={`/account/${currentAccount}/overview`}
                                                            className={cnames({active: active.indexOf("account/") !== -1})}><Translate
                            content="header.account"/></Link></li>}
                        {<li><a className={cnames({active: active.indexOf("explorer") !== -1})}
                                onClick={this._onNavigate.bind(this, "/explorer")}><Translate component="span"
                                                                                              content="header.explorer"/></a>
                        </li>}
                    </ul>
                </div>*/}
               {/* <div className="grid-block show-for-medium shrink">
                    <div className="grp-menu-items-group header-right-menu">

                        {!myAccountCount || !walletBalance ? null : walletBalance}

                        {myAccountCount !== 0 ? null : <div className="grp-menu-item overflow-visible">
                            {settingsDropdown}
                        </div>}
                        {myAccountCount !== 0 ? null : <div className="grp-menu-item overflow-visible">
                            {flagDropdown}
                        </div>}

                        <div className="grp-menu-item overflow-visible account-drop-down">
                            {accountsDropDown}
                        </div>
                        {!myAccountCount ? null : <div className="grp-menu-item overflow-visible account-drop-down">
                            {flagDropdown}
                        </div>}
                        {!myAccountCount ? null : <div className="grp-menu-item overflow-visible">
                            {settingsDropdown}
                        </div>}

                        {lock_unlock}
                    </div>
                </div>*/}
                
            </div>
        );
    }
}

export default connect(Header, {
    listenTo() {
        return [AccountStore, WalletUnlockStore, WalletManagerStore, SettingsStore];
    },
    getProps() {
        const chainID = Apis.instance().chain_id;
        return {
            linkedAccounts: AccountStore.getState().linkedAccounts,
            currentAccount: AccountStore.getState().currentAccount,
            locked: WalletUnlockStore.getState().locked,
            current_wallet: WalletManagerStore.getState().current_wallet,
            lastMarket: SettingsStore.getState().viewSettings.get(`lastMarket${chainID ? ("_" + chainID.substr(0, 8)) : ""}`),
            starredAccounts: SettingsStore.getState().starredAccounts,
            currentLocale: SettingsStore.getState().settings.get("locale"),
            locales: SettingsStore.getState().defaults.locale
        };
    }
});
