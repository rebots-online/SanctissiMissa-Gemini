
import React, { Fragment } from 'react';
import { MassData, Translation } from '../types';
import AccordionSection from './AccordionSection';
import InteractiveText from './InteractiveText';
import { ORDINARY_TEXTS } from '../constants';

interface MassProps {
    massData: MassData;
}

const SideBySide: React.FC<{ latin: React.ReactNode, english: React.ReactNode }> = ({ latin, english }) => (
    <div className="side-by-side grid md:grid-cols-2 gap-8">
        <div className="latin-column">{latin}</div>
        <div className="english-column">{english}</div>
    </div>
);

const ProperSection: React.FC<{ title: string, content: Translation | Translation[], reference?: string }> = ({ title, content, reference }) => (
    <div className="propers-section p-4 rounded-lg mb-6">
        <h3 className="text-xl font-bold mb-2 text-gray-800 font-crimson-pro">{title}</h3>
        {reference && <p className="rubric text-sm mb-2">{reference}</p>}
        <SideBySide
            latin={
                <div className="space-y-1">
                    {Array.isArray(content) 
                        ? content.map((item, i) => <InteractiveText key={i} latin={item.latin} english={item.english} />)
                        : <InteractiveText latin={content.latin} english={content.english} />
                    }
                </div>
            }
            english={
                 <div className="space-y-1 text-gray-600">
                    {Array.isArray(content) 
                        ? content.map((item, i) => <p key={i}>{item.english}</p>)
                        : <p>{content.english}</p>
                    }
                </div>
            }
        />
    </div>
);

const Mass: React.FC<MassProps> = ({ massData }) => {
    const { liturgicalDate, propers } = massData;

    const renderTextSection = (section: { title: string; dialogues: { P?: string; S?: string; N?: string }[] }) => (
        <>
            <h3 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2 font-crimson-pro">{section.title}</h3>
            <SideBySide
                latin={
                    <div className="space-y-2">
                        {section.dialogues.map((d, i) => (
                           d.N ? <InteractiveText key={i} latin={d.N.split('|')[0]} english={d.N.split('|')[1]} />
                           : d.P ? <InteractiveText key={i} speaker="P" latin={d.P.split('|')[0]} english={d.P.split('|')[1]} />
                           : d.S ? <InteractiveText key={i} speaker="S" latin={d.S.split('|')[0]} english={d.S.split('|')[1]} />
                           : null
                        ))}
                    </div>
                }
                english={
                    <div className="space-y-2 text-gray-600">
                         {section.dialogues.map((d, i) => (
                           <p key={i}>
                            {d.N ? '' : d.P ? <span className="dialogue-priest">P. </span> : <span className="dialogue-server">S. </span>}
                            {(d.N || d.P || d.S)?.split('|')[1]}
                           </p>
                        ))}
                    </div>
                }
            />
        </>
    );

    return (
        <div>
            <AccordionSection title="I. The Preparation" startOpen={true}>
                {renderTextSection(ORDINARY_TEXTS.prayersAtFoot)}
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.confiteor)}</div>
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.ascentPrayers)}</div>
            </AccordionSection>

            <AccordionSection title="II. Mass of the Catechumens">
                <ProperSection title="Introit" content={propers.introit.antiphon} reference={propers.introit.verse.reference}/>
                <SideBySide
                    latin={<><InteractiveText latin={propers.introit.verse.latin} english={propers.introit.verse.english} /><InteractiveText latin={ORDINARY_TEXTS.gloriaPatri.latin} english={ORDINARY_TEXTS.gloriaPatri.english} /><InteractiveText latin={propers.introit.antiphon.latin} english={propers.introit.antiphon.english} /></>}
                    english={<><p>{propers.introit.verse.english}</p><p>{ORDINARY_TEXTS.gloriaPatri.english}</p><p>{propers.introit.antiphon.english}</p></>}
                />

                <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.kyrie)}</div>

                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 font-crimson-pro">Gloria</h3>
                    <p className="rubric text-sm mb-3">{liturgicalDate.omitGloria ? `Omitted during ${liturgicalDate.season}` : "Said on Sundays (outside of Advent/Lent), solemnities, and feasts."}</p>
                    {!liturgicalDate.omitGloria && renderTextSection(ORDINARY_TEXTS.gloria)}
                </div>

                <div className="mt-6">
                    {renderTextSection(ORDINARY_TEXTS.dominusVobiscumOremus)}
                    <ProperSection title="Collect" content={propers.collect} />
                </div>
                
                <ProperSection title="Epistle" content={propers.epistle} reference={propers.epistle.reference} />
                
                {propers.gradual && <ProperSection title="Gradual" content={[propers.gradual.verse1, propers.gradual.verse2]} />}
                {propers.alleluia && <ProperSection title="Alleluia" content={[{latin: "Allelúia, allelúia.", english:"Alleluia, alleluia."}, propers.alleluia.verse, {latin: "Allelúia.", english: "Alleluia."}]} />}
                {propers.tract && <ProperSection title="Tract" content={propers.tract.verses} />}

                <div className="mt-6">
                    <ProperSection title="Gospel" content={propers.gospel} reference={propers.gospel.reference} />
                </div>
                 
                <div className="mt-6">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 font-crimson-pro">Credo</h3>
                    <p className="rubric text-sm mb-3">{liturgicalDate.omitCredo ? "Omitted today" : "Said on Sundays and major feasts"}</p>
                    {!liturgicalDate.omitCredo && renderTextSection(ORDINARY_TEXTS.credo)}
                </div>
            </AccordionSection>

             <AccordionSection title="III. Mass of the Faithful">
                 {renderTextSection(ORDINARY_TEXTS.dominusVobiscumOremus)}
                 <ProperSection title="Offertory" content={propers.offertory} />
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.offertoryPrayers)}</div>
                 <ProperSection title="Secret" content={propers.secret} />
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.preface)}</div>
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.sanctus)}</div>
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.canon)}</div>
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.paterNoster)}</div>
                 <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.agnusDei)}</div>
                 <ProperSection title="Communion" content={propers.communion} />
                 {renderTextSection(ORDINARY_TEXTS.dominusVobiscumOremus)}
                 <ProperSection title="Postcommunion" content={propers.postcommunion} />
             </AccordionSection>

            <AccordionSection title="IV. The Dismissal">
                {renderTextSection(ORDINARY_TEXTS.dismissal)}
                <div className="mt-6">{renderTextSection(ORDINARY_TEXTS.lastGospel)}</div>
            </AccordionSection>
        </div>
    );
};

export default Mass;
