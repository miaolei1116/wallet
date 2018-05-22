import React from "react";
import {PropTypes} from "react";
import {Link} from "react-router/es";
import counterpart from "counterpart";
import ReactTooltip from "react-tooltip";
import Icon from "../Icon/Icon";
import AccountInfo from "./AccountInfo";
import Translate from "react-translate-component";
import AccountActions from "actions/AccountActions";
import SettingsActions from "actions/SettingsActions";
import AccountImage from "./AccountImage";

class AccountLeftPanel extends React.Component {

	static propTypes = {
		account: React.PropTypes.object.isRequired,
		linkedAccounts: PropTypes.object,
	};

	static contextTypes = {
		history: React.PropTypes.object
	}

	constructor(props) {
		super(props);
		this.last_path = null;

		this.state = {
			showAdvanced: props.viewSettings.get("showAdvanced", false)
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		const changed = this.last_path !== window.location.hash;
		this.last_path = window.location.hash;
		return (
			changed ||
			this.props.account !== nextProps.account ||
			this.props.linkedAccounts !== nextProps.linkedAccounts ||
			nextState.showAdvanced !== this.state.showAdvanced
		);
	}

	componentWillUnmount() {
		ReactTooltip.hide();
	}

	onLinkAccount(e) {
		e.preventDefault();
		AccountActions.linkAccount(this.props.account.get("name"));
	}

	onUnlinkAccount(e) {
		e.preventDefault();
		AccountActions.unlinkAccount(this.props.account.get("name"));
	}

	_toggleAdvanced(e) {
		e.preventDefault();
		let newState = !this.state.showAdvanced;
		this.setState({
			showAdvanced: newState
		});

		SettingsActions.changeViewSetting({showAdvanced: newState});
	}
	_handleMouseOver(e){
		// console.log(e)
		// e.target.style.color = "rgba(76,209,144,1)"
		// console.log(e.target.parentNode)
	}	

	_handleMouseLeave(e){
		// console.log(e)
		// e.target.style.color = "#eee";
	}

	render() {
		let {account, linkedAccounts, isMyAccount} = this.props;
		let account_name = account.get("name");
		let linkBtn = null;

		linkBtn = isMyAccount ? null : linkedAccounts.has(account_name) ?
			<a style={{marginBottom: "1rem", marginRight: 0}} href className="button outline block-button" onClick={this.onUnlinkAccount.bind(this)}><Translate
				content="account.unfollow"/></a> :
			<a style={{marginBottom: "1rem", marginRight: 0}} href className="button outline block-button" onClick={this.onLinkAccount.bind(this)}><Translate
				content="account.follow"/></a>;

		let settings = counterpart.translate("header.settings");

		let caret = this.state.showAdvanced ? <span>&#9660;</span> : <span>&#9650;</span>;

		return (
			<div className="grid-block vertical account-left-panel no-padding no-overflow">
				<div className="grid-block" style={{backgroundColor:"rgba(51,57,68,1)"}}>
					<div className="grid-content no-padding" style={{overflowX: "hidden"}}>

						<div className="regular-padding" style={{textAlign:"center",marginBottom:"1rem"}}>
							<AccountInfo account={account.get("id")} image_size={{height: 140, width: 140}} my_account={isMyAccount}/>
							{/*<div className="grid-container no-margin">
								{ linkBtn }
								<Link className="pay-button button small block-button" to={`/transfer/?to=${account_name}`}><Translate content="account.pay"/></Link>
							</div>*/}
						</div>
						<section className="block-list">
							<ul id="sliderMain" className="" style={{marginBottom: 0,fontWight:"blod",textAlign:"center"}}>
								<li style={{border:"0px"}} onMouseOver={this._handleMouseOver} onMouseLeave={this._handleMouseLeave}>
									{/*<div style={{position:"absolute"}}>
										<Icon name="user" size="2dx" />
									</div>*/}
									<Link to={`/account/${account_name}/overview/`} activeClassName="active">首页</Link>
								</li>
                                {/*{isMyAccount?<li><Link to={`/account/${account_name}/assets/`} activeClassName="active"><Translate content="account.asset"/></Link></li>:null}*/}
                                <li style={{border:"0px"}} onMouseOver={this._handleMouseOver} onMouseLeave={this._handleMouseLeave}>
                                	<Link to={`/explorer/blocks`} activeClassName="active">区块链</Link>
                            	</li>
								<li style={{border:"0px"}} onMouseOver={this._handleMouseOver} onMouseLeave={this._handleMouseLeave}>
									<Link to={`/explorer`} activeClassName="active">浏览</Link>
								</li>
								{/*{isMyAccount?<li><Link to={`/account/${account_name}/whitelist/`} activeClassName="active"><Translate content="account.whitelist.title"/></Link></li>:null}*/}
								{/*<li><Link to={`/account/${account_name}/whitelist/`} activeClassName="active"><Translate content="account.whitelist.title"/></Link></li>*/}
								<li style={{border:"0px"}} onMouseOver={this._handleMouseOver} onMouseLeave={this._handleMouseLeave} onMouseOver={this._handleMouseOver} onMouseLeave={this._handleMouseLeave}>
									<Link to={`/walletControl`} activeClassName="active">钱包</Link>
								</li>
								{/*<li><Link to={`/account/${account_name}/voting/`} activeClassName="active"><Translate content="account.voting"/></Link></li>*/}
                                {/*{isMyAccount?<li><Link to={`/account/${account_name}/vesting/`} activeClassName="active"><Translate content="account.vesting.title"/></Link></li>:null}*/}
								{/*<li><Link to={`/account/${account_name}/permissions/`} activeClassName="active"><Translate content="account.permissions"/></Link></li>*/}
								<li style={{border:"0px"}} onMouseOver={this._handleMouseOver} onMouseLeave={this._handleMouseLeave}>
									<Link to={`/settings`} activeClassName="active">设置</Link>
								</li>
							</ul>
						</section>
					</div>
				</div>
			</div>
		);
	}
}

export default AccountLeftPanel;
