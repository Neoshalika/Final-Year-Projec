package bit.project.server.entity;

import lombok.Data;
import java.util.List;
import javax.persistence.*;
import javax.persistence.Id;
import java.math.BigDecimal;
import javax.persistence.Lob;
import java.time.LocalDateTime;
import lombok.NoArgsConstructor;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Data
@Entity
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Material{
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Integer id;

    private String code;

    private String name;

    private BigDecimal qty;

    private BigDecimal rop;

    private BigDecimal lastprice;

    private BigDecimal oneunitprice;

    private String photo;

    @Lob
    private String description;

    private LocalDateTime tocreation;


    @ManyToOne
    private Materialsubcategory materialsubcategory;

    @ManyToOne
    private Unit unit;

    @ManyToOne
    private Materialstatus materialstatus;

    @ManyToOne
    @JsonIgnoreProperties({"creator","status","tocreation","roleList"})
    private User creator;


    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Materialdisposalmaterial> materialdisposalmaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Pordermaterial> pordermaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Prmaterialreturnmaterial> prmaterialreturnmaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Productmaterial> productmaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Prordermaterial> prordermaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Purchasematerial> purchasematerialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Supplierrefundmaterial> supplierrefundmaterialList;

    @JsonIgnore
    @OneToMany(mappedBy = "material")
    private List<Supplierreturnmaterial> supplierreturnmaterialList;


    public Material(Integer id){
        this.id = id;
    }

    public Material(Integer id, String code, Materialsubcategory materialsubcategory, String name, String photo){
        this.id = id;
        this.code = code;
        this.materialsubcategory = materialsubcategory;
        this.name = name;
        this.photo = photo;
    }

}
