import React, { useState } from "react";
import { LocalizedString } from "../components/localized-string";
import { Menu } from "../components/menu";

export function NewGame({ campaigns, onNewGame, language, onBack }: { campaigns?: any[], onNewGame: (campaignId: string, publiclyAvailable: boolean) => void, language: string, onBack: () => void }): React.ReactElement {
  const [selectedCampaign, setCampaign] = useState<any>(undefined);
  const [publiclyAvailable, setPubliclyAvailable] = useState(false);
  return <Menu className="spacing-2" style={{
    display: "flex"
  }}>
    <div style={{
        flex: 2
    }}>
        <h2>Create a game</h2>
        {!campaigns && <p>Loading...</p>}
        {campaigns && campaigns.length === 0 && <p>No campaigns available for play.</p>}
        {campaigns && campaigns.length > 0 && <form onSubmit={e => e.preventDefault()}>
            <ul>
                {campaigns.map(campaign => <li key={campaign.id}>
                    <button onClick={() => setCampaign(campaign)}>
                        <LocalizedString language={language} translations={campaign.name} />
                    </button>
                </li>)}
            </ul>
            <div className="form-group">
                <LocalizedString language={language} translations={{
                    en: "Visibility"
                }} />
                <label>
                    <input type="checkbox" checked={publiclyAvailable} onChange={({target: {checked}}) => setPubliclyAvailable(checked)} />
                    <LocalizedString
                        language={language}
                        translations={{
                            en: "Anyone can join"
                        }}
                    />
                </label>
            </div>
            <button disabled={!selectedCampaign} onClick={() => onNewGame(selectedCampaign.campaignId, publiclyAvailable)}>
                <LocalizedString
                    language={language}
                    translations={{
                        en: "Start Game"
                    }}
                />
            </button>
            <button onClick={onBack}><LocalizedString language={language} translations={{en: "Back"}} /></button>
        </form>}
    </div>
    {selectedCampaign &&
        <div style={{
            flex: 1
        }}>
            <h2><LocalizedString language={language} translations={selectedCampaign.name} /></h2>
            <hr />
            <p><LocalizedString language={language} translations={selectedCampaign.description} /></p>
        </div>
    }
  </Menu>
}