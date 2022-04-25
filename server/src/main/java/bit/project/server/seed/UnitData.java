package bit.project.server.seed;

import java.util.Hashtable;
import bit.project.server.util.seed.SeedClass;
import bit.project.server.util.seed.AbstractSeedClass;

@SeedClass
public class UnitData extends AbstractSeedClass {

    public UnitData(){
        addIdNameData(1, "Foot");
        addIdNameData(2, "Inch");
        addIdNameData(3, "Bottle");
        addIdNameData(4, "Sheet");
        addIdNameData(5, "Gram");
        addIdNameData(6, "Roll");
        addIdNameData(7, "Meter");
    }

}