import React from "react";
import { ChangeActiveWallet, WalletDelete} from "../Wallet/WalletManager";
import BalanceClaimActive from "../Wallet/BalanceClaimActive";
import Translate from "react-translate-component";
import counterpart from "counterpart";
import WalletDb from "stores/WalletDb";

export default class WalletSettings extends React.Component {

    constructor() {
        super();

        this.state = {
            lookupActive: false,
            resetMessage: null
        };
    }

    onLookup() {
        this.setState({
            lookupActive: !this.state.lookupActive
        });
    }

    onResetBrainkeySequence() {
        WalletDb.resetBrainKeySequence();
        this.setState({
            resetMessage: counterpart.translate("wallet.brainkey_reset_success")
        });
    }

    render() {
        let {lookupActive} = this.state;

        return (
            <div>

                <ChangeActiveWallet />
                <WalletDelete />
                {/*<section style={{padding: "15px 0"}} className="block-list">
                    <header><Translate content="wallet.balance_claims" />:</header>

                </section>

                <div style={{paddingBottom: 10}}>
                    <Translate content="settings.lookup_text" />:
                </div>
                <div className="button outline" onClick={this.onLookup.bind(this)}>
                        <Translate content="wallet.balance_claim_lookup" />
                </div>*/}

                {lookupActive ? <BalanceClaimActive /> : null}


                <section style={{padding: "15px 0"}} className="block-list grid-block">
                    <header className="grid-content medium-2"><Translate content="wallet.brainkey_seq_reset" />:</header>
                    <p className="grid-content" style={{paddingLeft:"40px",paddingTop:"5px"}}><Translate unsafe content="wallet.brainkey_seq_reset_text" /></p>
                </section>
                <div style={{paddingBottom: 10,marginLeft:"50%",transform:"translateX(-50%)"}}>

                    <div className="button success" onClick={this.onResetBrainkeySequence.bind(this)}>
                            <Translate content="wallet.brainkey_seq_reset_button" />
                    </div>
                    {this.state.resetMessage ? <p style={{paddingTop: 10}} className="facolor-success">{this.state.resetMessage}</p> : null}
                </div>

            </div>
        );
    }
};
