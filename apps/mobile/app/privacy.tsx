import { Platform, ScrollView, Text, View } from 'react-native';

const LAST_UPDATED = '3 mars 2025';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold text-zinc-900 mb-2">{title}</Text>
      {children}
    </View>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <Text className="text-sm text-zinc-700 leading-5 mb-2">{children}</Text>;
}

function Li({ children }: { children: React.ReactNode }) {
  return (
    <View className="flex-row ml-2 mb-1">
      <Text className="text-sm text-zinc-700 mr-2">{'\u2022'}</Text>
      <Text className="text-sm text-zinc-700 leading-5 flex-1">{children}</Text>
    </View>
  );
}

export default function PrivacyScreen() {
  const maxWidth = Platform.OS === 'web' ? 680 : undefined;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-10 self-center w-full" style={{ maxWidth }}>
        <Text className="text-2xl font-bold text-zinc-900 mb-1">
          Politique de confidentialit\u00e9
        </Text>
        <Text className="text-xs text-zinc-400 mb-8">
          Derni\u00e8re mise \u00e0 jour : {LAST_UPDATED}
        </Text>

        <Section title="1. Introduction">
          <P>
            B-Spot est une application mobile qui permet aux consommateurs de scanner des
            codes-barres de produits afin de d\u00e9couvrir les entreprises, dirigeants et
            actionnaires derri\u00e8re les marques qu&apos;ils consomment.
          </P>
          <P>
            La pr\u00e9sente politique de confidentialit\u00e9 d\u00e9crit les donn\u00e9es que nous
            collectons, pourquoi nous les collectons et comment nous les utilisons.
          </P>
        </Section>

        <Section title="2. Donn\u00e9es collect\u00e9es">
          <P>
            Nous collectons uniquement les donn\u00e9es strictement n\u00e9cessaires au
            fonctionnement de l&apos;application :
          </P>
          <Li>
            Codes-barres scann\u00e9s : utilis\u00e9s pour identifier les produits via les bases
            Open Food Facts et Open Beauty Facts.
          </Li>
          <Li>
            Historique de scans : stock\u00e9 localement sur votre appareil et, si vous cr\u00e9ez
            un compte, synchronis\u00e9 avec nos serveurs.
          </Li>
          <Li>
            Donn\u00e9es de compte (optionnel) : adresse e-mail si vous choisissez de cr\u00e9er un
            compte.
          </Li>
        </Section>

        <Section title="3. Utilisation de la cam\u00e9ra">
          <P>
            L&apos;application utilise la cam\u00e9ra de votre appareil exclusivement pour scanner
            les codes-barres des produits. Aucune image ou vid\u00e9o n&apos;est enregistr\u00e9e,
            stock\u00e9e ou transmise. Le flux cam\u00e9ra est trait\u00e9 en temps r\u00e9el sur
            votre appareil uniquement.
          </P>
        </Section>

        <Section title="4. Pas de revente de donn\u00e9es">
          <P>
            Nous ne vendons, ne louons et ne partageons aucune donn\u00e9e personnelle avec des
            tiers \u00e0 des fins commerciales ou publicitaires. Vos donn\u00e9es ne sont jamais
            utilis\u00e9es pour du ciblage publicitaire.
          </P>
        </Section>

        <Section title="5. Publicit\u00e9s">
          <P>
            B-Spot ne contient aucune publicit\u00e9 et n&apos;int\u00e8gre aucun SDK publicitaire.
          </P>
        </Section>

        <Section title="6. Services tiers">
          <P>Nous utilisons les services tiers suivants :</P>
          <Li>
            Open Food Facts / Open Beauty Facts : bases de donn\u00e9es ouvertes de produits
            alimentaires et cosm\u00e9tiques. Seul le code-barres est transmis pour identifier le
            produit.
          </Li>
          <Li>
            Pappers : base de donn\u00e9es publique d&apos;informations l\u00e9gales sur les
            entreprises fran\u00e7aises (donn\u00e9es accessibles publiquement).
          </Li>
        </Section>

        <Section title="7. Stockage et s\u00e9curit\u00e9">
          <P>
            Les donn\u00e9es sont stock\u00e9es sur des serveurs s\u00e9curis\u00e9s. Les
            communications entre l&apos;application et nos serveurs sont chiffr\u00e9es via HTTPS.
            Les donn\u00e9es d&apos;authentification sont stock\u00e9es de mani\u00e8re
            s\u00e9curis\u00e9e sur votre appareil.
          </P>
        </Section>

        <Section title="8. Vos droits">
          <P>
            Conform\u00e9ment au R\u00e8glement G\u00e9n\u00e9ral sur la Protection des Donn\u00e9es
            (RGPD), vous disposez des droits suivants :
          </P>
          <Li>Droit d&apos;acc\u00e8s \u00e0 vos donn\u00e9es personnelles</Li>
          <Li>Droit de rectification</Li>
          <Li>Droit \u00e0 l&apos;effacement (droit \u00e0 l&apos;oubli)</Li>
          <Li>Droit \u00e0 la portabilit\u00e9 de vos donn\u00e9es</Li>
          <Li>Droit d&apos;opposition au traitement</Li>
          <P>Pour exercer ces droits, contactez-nous \u00e0 l&apos;adresse : contact@b-spot.org</P>
        </Section>

        <Section title="9. Donn\u00e9es des enfants">
          <P>
            B-Spot ne cible pas les enfants de moins de 13 ans. Nous ne collectons pas sciemment de
            donn\u00e9es personnelles d&apos;enfants. Si vous \u00eates parent et pensez que votre
            enfant nous a fourni des donn\u00e9es, contactez-nous pour que nous les supprimions.
          </P>
        </Section>

        <Section title="10. Modifications">
          <P>
            Nous pouvons mettre \u00e0 jour cette politique de confidentialit\u00e9. Les
            modifications seront publi\u00e9es sur cette page avec la date de mise \u00e0 jour. Nous
            vous encourageons \u00e0 consulter r\u00e9guli\u00e8rement cette page.
          </P>
        </Section>

        <Section title="11. Contact">
          <P>
            Pour toute question concernant cette politique de confidentialit\u00e9, contactez-nous
            \u00e0 : contact@b-spot.org
          </P>
        </Section>
      </View>
    </ScrollView>
  );
}
