import { React, useState } from 'react';

const Input = (props) => {
    const { onChange, value, type, required, id, label } = props;
    return (
        <div className="form-group">
            <label htmlFor={id}>{required ? <span style={{color: 'red'}}>* </span> : ''}{label}</label>
            <input id={id} value={value} onChange={onChange} required={required} type={type} />
        </div>
    );
}

const TextArea = (props) => {
    const { onChange, value, required, id, label } = props;
    return (
        <div className="form-group">
            <label htmlFor={id}>{required ? <span style={{color: 'red'}}>* </span> : ''}{label}</label>
            <textarea cols={3} id={id} value={value} onChange={onChange} required={required}></textarea>
        </div>
    );
}

export const Form = () => {
    const selectOptions = [
        'Bröllop',
        'Begravning',
        'Dop',
        'Övrigt',
    ];

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [date, setDate] = useState('');
    const [subject, setSubject] = useState(selectOptions[0]);

    function sendEmail() {
        const valid = subject.length > 0 && name.length > 0 && message.length > 0;
        if (!valid) {
            return;
        }

        const cc = email.length > 0 ? `cc=${email}` : '';
        const emailSubject = date.length > 0 ? `${subject} - ${date}` : subject;
        const body = `${message} %0D%0A%0D%0A/${name}`;

        let url = `mailto:rebeccalennartsson1@gmail.com?subject=${emailSubject}&${cc}&body=${body}`;
        // return url
        window.location.href = url;
    }
    return (
        <section id="form" className="page-section">
            <h1 className="title">Kontakt</h1>
            <div className="text">
                <p>
                    Intresserad av att komma i kontakt med mig eller boka mig för ett event?
                    <br />
                    Skicka ett meddelande till mig genom att fylla i dina uppgifter i formuläret så återkommer jag så fort jag kan.
                </p>
                <p>Tack!</p>
            </div>
            <form className="form">
                <div className="form-group">
                    <label htmlFor="subject">Ämne</label>
                    <select id="subject" value={subject} onChange={(e) => setSubject(e.target.value)}>
                        {selectOptions.map((o, key) => <option key={key} value={o}>{o}</option>)}
                    </select>
                </div>

                <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required={true} label="Namn:" />
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required={false} label="E-post:" />
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required={false} label="Önskat datum:" />
                <TextArea id="message" value={message} onChange={(e) => setMessage(e.target.value)} required={true} label="Meddelande:" />

               <button onClick={sendEmail}>Kom i kontakt med mig!</button>
            </form>
        </section>
    );
};