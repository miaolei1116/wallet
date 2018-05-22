import React, {Component} from "react";
import {Link} from "react-router";
import Translate from "react-translate-component";
import notify from "actions/NotificationActions";
import cname from "classnames"; 
import WalletDb from "stores/WalletDb";
import PasswordConfirm from "./PasswordConfirm";

export default class WalletChangePassword extends Component {
    constructor() {
        super()
        this.state = {success: false}
    }

    onAccept(e) {
        e.preventDefault();
        var {old_password, new_password} = this.state
        WalletDb.changePassword(old_password, new_password, true/*unlock*/)
            .then(() => {
                notify.success("Password changed")
                this.setState({success: true});
                // window.history.back();
            })
            .catch( error => {
                // Programmer or database error ( validation missed something? )
                // .. translation may be unnecessary
                console.error(error)
                notify.error("Unable to change password: " + error)
            })
    }

    onOldPassword(old_password) { this.setState({ old_password }); }
    onNewPassword(new_password) { this.setState({ new_password }); }

    _onCancel() {
        this.setState({
            old_password: ""
        });

        this.refs.pwd.cancel();
    }

    render() {
        var ready = !!this.state.new_password;
        let {success} = this.state;

        if (success) {
            return (
                <div className="" style={{fontWight:"bold"}}>
                    <Translate component="p" content="wallet.change_success" />
                    <Translate component="p" content="wallet.change_backup" />
                    <div style={{padding:"3rem 0rem 0rem 10rem"}}>
                        <Link to="/wallet/backup/create" className="button success" style={{display:"inline-block",padding:0}}>
                            <div style={{padding:"0.65rem 1.2rem",backgroundColor:"transparent"}}>
                                <Translate content="wallet.create_backup" />
                            </div>
                        </Link>
                    </div>
                </div>
            );
        }

        return <span>
            <WalletPassword ref="pwd" onValid={this.onOldPassword.bind(this)}>
                <PasswordConfirm
                    onSubmit={this.onAccept.bind(this)}
                    newPassword={true}
                    onValid={this.onNewPassword.bind(this)}
                >
                    <div style={{paddingLeft:"15rem"}}>
                        <a className="success button medium-2" style={{display:"inline-block",padding:0}}>
                            <button
                                type="submit"
                                onClick={this.onAccept.bind(this)}
                                style={{padding:"0.65rem 1.2rem",backgroundColor:"transparent"}}
                            >
                                {/*<Translate content="wallet.accept" />*/}
                                保存
                            </button>
                        </a>
                        <a className="hollow button medium-2" style={{display:"inline-block",padding:0}}>
                            <div className="" onClick={this._onCancel.bind(this)} style={{padding:"0.65rem 1.2rem"}}>
                                <Translate content="wallet.cancel" />
                            </div>
                        </a>
                    </div>
            </PasswordConfirm>
            </WalletPassword>

        </span>
    }
}

class WalletPassword extends Component {

    static propTypes = {
        onValid: React.PropTypes.func.isRequired
    };

    constructor() {
        super()
        this.state = {
            password: "",
            verified: false
        }
    }

    cancel() {
        this.setState({
            verified: false,
            password: ""
        });
    }

    onPassword(e) {
        e.preventDefault();
        if( WalletDb.validatePassword(this.state.password) ) {
            this.setState({ verified: true })
            this.props.onValid(this.state.password)
        } else
            notify.error("Invalid Password")
    }

    formChange(event) {
        var state = {}
        state[event.target.id] = event.target.value
        this.setState(state)
    }

    render() {
        if(this.state.verified) {
            return <div className="grid-content">{this.props.children}</div>;
        } else {
            return (
                <form onSubmit={this.onPassword.bind(this)}>

                    <div className="grid-block medium-10" style={{marginLeft:"1rem",lineHeight:"2rem",marginBottom:"3rem"}}>
                        <div className="grid-block medium-4 small-12">
                            <label><Translate content="wallet.existing_password"/></label>
                            {/*当前密码*/}
                        </div>
                        <div className="grid-block medium-4">
                            <section>
                                <input
                                    placeholder="请输入当前密码"
                                    type="password"
                                    id="password"
                                    onChange={this.formChange.bind(this)}
                                    value={this.state.password}
                                />
                            </section>
                        </div> 
                    </div>
                    <div style={{paddingLeft:"15rem"}}>
                        {/*<button style={{padding:0}}>
                            <a className="success button" style={{display:"inline-block",width:"100%",height:"100%"}}>下一步</a>
                        </button>*/}
                        <a className="success button medium-2" style={{display:"inline-block",padding:0}}>
                            <button style={{padding:"0.85rem 1rem",backgroundColor:"transparent"}}>下一步</button>
                        </a>
                    </div>
                </form>
            );
        }
    }

}

class Reset extends Component {

    render() {
        var label = this.props.label || <Translate content="wallet.reset" />
        return  <span className="button outline"
            onClick={this.onReset.bind(this)}>{label}</span>
    }

    onReset() {
        window.history.back()
    }
}
