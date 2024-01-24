import { AdvancedType, BasicType } from "@easy-email-core";
import { Accordion } from "./Accordion";
import { AccordionElement } from "./AccordionElement";
import { AccordionText } from "./AccordionText";
import { AccordionTitle } from "./AccordionTitle";
import { Button } from "./Button";
import { Carousel } from "./Carousel";
import { Column } from "./Column";
import { Divider } from "./Divider";
import { Group } from "./Group";
import { Hero } from "./Hero";
import { Image } from "./Image";
import { Navbar } from "./Navbar";
import { Page } from "./Page";
import { Raw } from "./Raw";
import { Section } from "./Section";
import { Social } from "./Social";
import { Spacer } from "./Spacer";
import { Table } from "./Table";
import { Text } from "./Text";
import { Wrapper } from "./Wrapper";

export const blocks = {
  [BasicType.PAGE]: Page,
  [BasicType.SECTION]: Section,
  [BasicType.COLUMN]: Column,
  [BasicType.TEXT]: Text,
  [BasicType.IMAGE]: Image,
  [BasicType.GROUP]: Group,
  [BasicType.BUTTON]: Button,
  [BasicType.DIVIDER]: Divider,
  [BasicType.WRAPPER]: Wrapper,
  [BasicType.SPACER]: Spacer,
  [BasicType.RAW]: Raw,
  [BasicType.ACCORDION]: Accordion,
  [BasicType.ACCORDION_ELEMENT]: AccordionElement,
  [BasicType.ACCORDION_TITLE]: AccordionTitle,
  [BasicType.ACCORDION_TEXT]: AccordionText,
  [BasicType.CAROUSEL]: Carousel,
  [BasicType.HERO]: Hero,
  [BasicType.NAVBAR]: Navbar,
  [BasicType.SOCIAL]: Social,
  [BasicType.TABLE]: Table,

  [AdvancedType.TEXT]: Text,
  [AdvancedType.IMAGE]: Image,
  [AdvancedType.BUTTON]: Button,
  [AdvancedType.DIVIDER]: Divider,
  [AdvancedType.SPACER]: Spacer,
  [AdvancedType.ACCORDION]: Accordion,
  [AdvancedType.CAROUSEL]: Carousel,
  [AdvancedType.NAVBAR]: Navbar,
  [AdvancedType.SOCIAL]: Social,

  [AdvancedType.HERO]: Hero,
  [AdvancedType.WRAPPER]: Wrapper,
  [AdvancedType.SECTION]: Section,
  [AdvancedType.GROUP]: Group,
  [AdvancedType.COLUMN]: Column,
};
